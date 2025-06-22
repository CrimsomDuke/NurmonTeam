import { Button, Col, Form, Row } from "react-bootstrap";
import '../../index.css'
import { Link, useNavigate } from "react-router";
import React, { useState } from "react";
import global_vars from "../../../global/global_vars";

const RegisterView = () => {

    const [errorMessage, setErrorMessage] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch(`${global_vars.API_URL}/users/register`, {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();
        if(response.ok){
            navigate('/auth/login');
        }else{
            setErrorMessage(data.error || data.message || "Registration failed. Please try again.");
        }
    }

    return (
        <>
            <section className="m-3 p-2 justify-content-center align-content-center vh-100">
                <Row className="d-flex justify-content-center">
                    <Col md={6} className="form-container card justify-content-center dark-mode">
                        <h1 className="m-3 p-2 text-center">Register</h1>
                        <Form onSubmit={handleRegister}>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter the username" className="form-control" 
                                    value={username} onChange={(e) => setUsername(e.target.value)} required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter the email" className="form-control" 
                                    value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter the password" 
                                    value={password} onChange={(e) => setPassword(e.target.value)} required/>
                            </Form.Group>
                            <div className="m-3">
                                <span>
                                    Ya tienes cuenta? <Link to="/auth/login">Login</Link>
                                </span>
                            </div>
                            <Form.Group className="m-3 d-flex align-content-center justify-content-center">
                                <Button type="submit">Register</Button>
                            </Form.Group>
                        </Form>
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                    </Col>
                </Row>
            </section >
        </>
    )
}

export default RegisterView;