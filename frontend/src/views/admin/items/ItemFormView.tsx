import { Link, useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../../components/admin/AdminNavbar";
import { Col, Form, Row } from "react-bootstrap";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import global_vars from "../../../../global/global_vars";


const ItemFormView = () => {

    const { getToken } = useAuth();
    const navigate = useNavigate();
    const params = useParams();

    const [errorMessage, setErrorMessage] = useState<string>('');

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<File | string | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchItemData();
        }
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(params.id){
            await handleUpdate();
        }else{
            await handleCreate();
        }
    }

    const handleUpdate = async () => {
        if (!validateFormFields()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image instanceof File) {
            formData.append('image', image);
        }

        try {
            const response = await fetch(`${global_vars.API_URL}/items/update/${params.id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (response.ok) {
                navigate('/admin/items');
            } else {
                const data = await response.json();
                console.log("Failed to update item:", data);
                setErrorMessage("Failed to update item. Please try again later." + data.data);
            }
        } catch (error) {
            console.log("Error updating item:", error);
            setErrorMessage("Failed to update item. Please try again later.");
        }
    }

    const handleCreate = async () => {
        if (!validateFormFields()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image instanceof File) {
            formData.append('image', image);
        }

        try {
            const response = await fetch(`${global_vars.API_URL}/items/create`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (response.ok) {
                navigate('/admin/items');
            } else {
                const data = await response.json();
                console.log("Failed to create item:", data);
                setErrorMessage("Failed to create item. Please try again later." + data.data);
            }
        } catch (error) {
            console.log("Error creating item:", error);
            setErrorMessage("Failed to create item. Please try again later.");
        }
    }

    const handleDelete = async () => {
        if (!params.id) {
            setErrorMessage("No item ID provided for deletion.");
            return;
        }

        try {
            const response = await fetch(`${global_vars.API_URL}/items/delete/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (response.ok) {
                navigate('/admin/items');
            } else {
                const data = await response.json();
                console.log("Failed to delete item:", data);
                setErrorMessage("Failed to delete item. Please try again later." + data.data);
            }
        } catch (error) {
            console.log("Error deleting item:", error);
            setErrorMessage("Failed to delete item. Please try again later.");
        }
    }

    const validateFormFields = () => {
        const errorFields : string[] = [];
        if (!name.trim()) {
            errorFields.push("name");
        } 
        if (!description.trim()) {
            errorFields.push("description");
        }
        if (!image) {
            errorFields.push("image");
        }

        if (errorFields.length > 0) {
            setErrorMessage(`Please fill in the following fields: ${errorFields.join(', ')}`);
            return false;
        }
        setErrorMessage('');
        return true;
    }

    const fetchItemData = async () => {
        try{
            const response = await fetch(`${global_vars.API_URL}/items/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                setName(data.name);
                setDescription(data.description);
                setImage(data.image_path || null);
            } else {
                console.log("Failed to fetch item data:", data);
                setErrorMessage("Failed to fetch item data. Please try again later." + data.data);
            }
        }catch(error){
            console.log("Error fetching item data:", error);
            setErrorMessage("Failed to fetch item data. Please try again later.");
        }
    }

    return (
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
                                <Form.Group className="mt-3">
                                    <Form.Label>Image</Form.Label>
                                    <Form.Control onChange={(e : React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files ? e.target.files[0] : null )} 
                                        type="file" accept="image/*" required={!image} />
                                </Form.Group>
                                { image && typeof image === 'string' && (
                                    <div className="mt-3">
                                        <img src={`${global_vars.UPLOADS_URL}/item/${image}`} alt="Item Preview" className="img-thumbnail" 
                                            style={{ maxHeight: "300px", maxWidth: "300px", minHeight: "200px", minWidth: "200px"  }} />
                                    </div>
                                )}

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
    );
}

export default ItemFormView;