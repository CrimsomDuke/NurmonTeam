
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../../components/admin/AdminNavbar";
import { Col, Form, Row } from "react-bootstrap";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import global_vars from "../../../../global/global_vars";
import CustomComboBox from '../../../components/shared/CustomComboBox';
import type { TypeDataDTO } from "../../../types/types";

const MovementFormView = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const params = useParams();

    const [name, setName] = useState<string>('');
    const [power, setPower] = useState<number>(0);
    const [isPhysical, setIsPhysical] = useState<boolean>(false);
    const [typeId, setTypeId] = useState<number | ''>('');

    const [types, setTypes] = useState<TypeDataDTO[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetchTypes();
        if (params.id) {
            fetchMovementData();
        }
    }, [params.id]);

    const fetchTypes = async () => {
        try {
            const res = await fetch(`${global_vars.API_URL}/types`);
            const data = await res.json();
            if (res.ok) {
                setTypes(data);
            } else {
                console.error("Failed to fetch types:", data);
            }
        } catch (err) {
            console.error("Error fetching types:", err);
        }
    };

    const fetchMovementData = async () => {
        try {
            const res = await fetch(`${global_vars.API_URL}/movements/${params.id}`);
            const data = await res.json();
            if (res.ok) {
                setName(data.name);
                setPower(data.power);
                setIsPhysical(data.is_physical);
                setTypeId(data.type_id);
            } else {
                console.error("Failed to fetch movement:", data);
                setErrorMessage("Failed to fetch movement. " + data.data);
            }
        } catch (err) {
            console.error("Error fetching movement:", err);
        }
    };

    const validateFields = (): boolean => {
        const errors: string[] = [];
        if (!name.trim()) errors.push("name");
        if (power <= 0) errors.push("power");
        if (!typeId) errors.push("type");

        if (errors.length) {
            setErrorMessage(`Please complete: ${errors.join(", ")}`);
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFields()) return;
        if (params.id) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const handleCreate = async () => {
        const body = { name, power, is_physical: isPhysical, type_id: (typeId as number) };

        console.log(body);

        try {
            const res = await fetch(`${global_vars.API_URL}/movements/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                navigate('/admin/movements');
            } else {
                const data = await res.json();
                console.error("Create failed:", data);
                setErrorMessage("Failed to create movement. " + data.data);
            }
        } catch (err) {
            console.error("Error creating movement:", err);
            setErrorMessage("Failed to create movement.");
        }
    };

    const handleUpdate = async () => {
        const body = { name, power, is_physical: isPhysical, type_id: typeId };

        try {
            const res = await fetch(`${global_vars.API_URL}/movements/update/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                navigate('/admin/movements');
            } else {
                const data = await res.json();
                console.error("Update failed:", data);
                setErrorMessage("Failed to update movement. " + data.data);
            }
        } catch (err) {
            console.error("Error updating movement:", err);
            setErrorMessage("Failed to update movement.");
        }
    };

    const handleDelete = async () => {
        if (!params.id) return;

        try {
            const res = await fetch(`${global_vars.API_URL}/movements/delete/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (res.ok) {
                navigate('/admin/movements');
            } else {
                const data = await res.json();
                console.error("Delete failed:", data);
                setErrorMessage("Failed to delete movement. " + data.data);
            }
        } catch (err) {
            console.error("Error deleting movement:", err);
        }
    };

    return (
        <>
            <AdminNavbar />
            <main className="container">
                <h1>Movement Form</h1>
                <Link to="/admin/movements" className="btn btn-secondary mb-3">Back to Movement List</Link>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <Row>
                    <Col md={8} className="card p-4 m-3 shadow-sm border-0">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Movement Name</Form.Label>
                                <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} 
                                    placeholder="Movement name" required />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Power</Form.Label>
                                <Form.Control type="number" value={power} onChange={e => setPower(Number(e.target.value))} required min={1} />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Is Physical?"
                                    checked={isPhysical}
                                    onChange={e => setIsPhysical(e.target.checked)}
                                />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Type</Form.Label>
                                <CustomComboBox<TypeDataDTO>
                                    dataSource={types}
                                    textField="name"
                                    valueField="id"
                                    selectedValue={typeId != 0 ?  typeId : ''}
                                    onChange={(val) => setTypeId(val as number)}
                                    required
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-center mt-4">
                                <button className="btn btn-primary" type="submit">Submit</button>
                            </div>

                            {params.id && (
                                <div className="d-flex justify-content-center mt-3">
                                    <button className="btn btn-danger" type="button" onClick={handleDelete}>Delete</button>
                                </div>
                            )}
                        </Form>
                    </Col>
                </Row>
            </main>
        </>
    );
};

export default MovementFormView;
