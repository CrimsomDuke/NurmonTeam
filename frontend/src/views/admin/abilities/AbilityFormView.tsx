import { Col, Form, Row } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import AdminNavbar from "../../../components/admin/AdminNavbar"
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import global_vars from "../../../../global/global_vars";


const AbilityFormView = () => {

    const { getToken } = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>(''); 

    const [errorMessage, setErrorMessage] = useState<string>('');


    useEffect(() => {
        if (params.id) {
            fetchAbilityData();
        }
    }, [params.id]);

    const fetchAbilityData = async () => {
        try {
            const response = await fetch(`${global_vars.API_URL}/abilities/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch ability data');
            }

            const data = await response.json();
            setName(data.name);
            setDescription(data.description);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    }

    const handleSubmit = async (e : React.FormEvent<HTMLElement>) => {
        e.preventDefault();

        if (!name || !description) {
            setErrorMessage('Name and description are required');
            return;
        }

        const abilityData = {
            name: name,
            description: description
        };

        try {
            const response = await fetch(`${global_vars.API_URL}/abilities/${params.id ? 'update/' + params.id : 'create'}`, {
                method: params.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(abilityData)
            });

            const data = await response.json();
            if (!response.ok) {
                console.log("Error response:", data.data);
                throw new Error('Failed to save ability data');
            }

            alert(`Ability ${params.id ? 'updated' : 'created'} successfully!`);
            navigate('/admin/abilities');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    }

    const handleDelete = async () => {
        if (!params.id) return;

        try {
            const response = await fetch(`${global_vars.API_URL}/abilities/delete/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete ability');
            }

            alert('Ability deleted successfully!');
            navigate('/admin/abilities');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    }

    return(
    <>
            <AdminNavbar />
            <main className="container">
                <h1>Item Form</h1>
                <Link to="/admin/items" className="btn btn-secondary mb-3">Back to Items List</Link>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="container">
                    <Row>
                        <Col md={8} className="container card m-3 p-3 shadow-sm border-0">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Item Name</Form.Label>
                                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter item name" 
                                        required/>
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} as="textarea" rows={3} 
                                        placeholder="Enter item description" required/>
                                </Form.Group>

                                <Form.Group className="mt-3 d-flex justify-content-center ">
                                    <button type="submit" className="btn btn-primary">Submit</button>    
                                </Form.Group>

                                { params.id && (
                                    <Form.Group className="d-flex justify-content-center mt-3">
                                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                    </Form.Group>
                                )}
                            </Form>
                        </Col>
                    </Row>
                </div>
            </main>
        </>
    )
}

export default AbilityFormView;