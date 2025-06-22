import { useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import global_vars from "../../../global/global_vars";



const LoginView = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { saveToken } = useAuth();

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch(`${global_vars.API_URL}/users/login`, {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                username,
                password
            })
        })

        const data = await response.json();
        if(response.ok) {
            saveToken(data.token);    
            navigate('/');
        } else {
            setErrorMessage(data.error);
        }
    }

    return (
        <>
            <section className="m-3 p-2 justify-content-center align-content-center vh-100">
                <Row className="d-flex justify-content-center">
                    <Col md={6} className="form-container card justify-content-center dark-mode">
                        <h1 className="m-3 p-2 text-center">Login</h1>
                        <Form onSubmit={handleLogin}>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter the username" className="form-control" 
                                    value={username} onChange={(e) => setUsername(e.target.value)} required/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter the password" 
                                    value={password} onChange={(e) => setPassword(e.target.value)} required/>
                            </Form.Group>
                            <div className="m-3">
                                <span>
                                    No tienes cuenta? <Link to="/auth/register">Registrate</Link>
                                </span>
                            </div>
                            <Form.Group className="m-3 d-flex align-content-center justify-content-center">
                                <Button type="submit">Login</Button>
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

export default LoginView;