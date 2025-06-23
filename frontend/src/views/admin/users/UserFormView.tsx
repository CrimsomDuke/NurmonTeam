import { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import global_vars from '../../../../global/global_vars';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../../components/admin/AdminNavbar';


const UserFormView = () => {

    const { getToken } = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        if(params.id){
            fetchUserData();
        }
    }, [params.id])

    const handleSubmit = async (e : React.FormEvent<HTMLElement>) => {
        e.preventDefault();

        const userUpdateData = {
            password : password || undefined,
            is_admin : isAdmin
        }

        try{
            const response = await fetch(`${global_vars.API_URL}/users/update/${params.id}`, {
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${getToken()}`
                },
                body : JSON.stringify(userUpdateData)
            })

            const data = await response.json();
            if(response.ok){
                alert('Se actualizó el usuario')
                navigate('/admin/');
                return;
            }

            setErrorMessage(data.data || data.error)
        }catch(error){
            console.error("Error updating user:", error);
            setErrorMessage("Failed to update user. Please try again later.");
        }
    }

    const fetchUserData = async () => {
        try{
            const response = await fetch(`${global_vars.API_URL}/users/${params.id}`, {
                method: 'GET',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${getToken()}`
                }
            });

            const data = await response.json();
            if(response.ok){
                setName(data.username || '');
                setEmail(data.email || '');
                setIsAdmin(data.is_admin || false);
            }
        }catch(error){
            console.error("Error fetching user data:", error);
            setErrorMessage("Failed to fetch user data. Please try again later.");
        }
    }

    return (
        <>
            <AdminNavbar />
            <main className="container p-3 m-3">
                <h1>User Form</h1>

                <Link to="/admin/" className="btn btn-secondary mb-3">Back to Users List</Link>
                <Row>
                    <p className="text-danger">{errorMessage}</p>
                    <Col md={5} className="d-flex justify-content-center align-items-center">
                        <Form className="form-container card p-3" onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter the username" className="form-control"
                                    value={name} disabled />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter the email" className="form-control" 
                                    value={email} onChange={(e) => setPassword(e.target.value)} disabled />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Change user's Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter a new password" 
                                    onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Form.Group className='m-4'>
                                <Form.Check 
                                    type="checkbox" 
                                    label="Set Admin Privileges" 
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}/>
                            </Form.Group>
                            <div className="d-flex justify-content-center m-3">
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </main>
        </>
    )
}

export default UserFormView;