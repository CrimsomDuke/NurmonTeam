import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import type { MovementDataDTO, NurmonMovementDataDTO } from "../../types/types";
import global_vars from "../../../global/global_vars";
import CustomComboBox from "../shared/CustomComboBox";


type NurmonMovementsProps = {
    nurmonId: number;
}

const NurmonMovementsFormView = (props : NurmonMovementsProps) => {
    const { getToken } = useAuth();

    const [allMovements, setAllMovements] = useState<MovementDataDTO[]>([]);
    const [assignedMovements, setAssignedMovements] = useState<NurmonMovementDataDTO[]>([]);
    const [selectedMovementId, setSelectedMovementId] = useState<number | ''>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetchAllMovements();
        fetchAssignedMovements();
        console.log("Nurmon ID:", props.nurmonId);
    }, [props.nurmonId]);

    const fetchAllMovements = async () => {
        const res = await fetch(`${global_vars.API_URL}/movements`, {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await res.json();
        if (res.ok) {
            setAllMovements(data);
        }
    };

    const fetchAssignedMovements = async () => {
        const res = await fetch(`${global_vars.API_URL}/nurmon_movements/nurmon/${props.nurmonId}`, {
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await res.json();
        if (res.ok) {
            setAssignedMovements(data);
            for (const entry of data) {
                console.log('Movement ID: ', entry.movement.id, "Type: ", entry.movement.type?.name);
            }
        }else{
            const errorData = await res.json();
            setErrorMessage("Error fetching assigned movements: " + errorData.data);
            console.error("Error fetching assigned movements:", errorData);
        }
    };

    const handleAddMovement = async () => {
        if (!selectedMovementId) return;

        const body = {
            nurmon_id: props.nurmonId.toString(),
            movement_id: selectedMovementId,
        };

        const res = await fetch(`${global_vars.API_URL}/nurmon_movements/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            await fetchAssignedMovements();
            setSelectedMovementId('');
        } else {
            const data = await res.json();
            setErrorMessage("Error adding movement: " + data.data);
        }
    };

    const handleRemoveMovement = async (id: number) => {
        const res = await fetch(`${global_vars.API_URL}/nurmon_movements/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (res.ok) {
            await fetchAssignedMovements();
        } else {
            const data = await res.json();
            setErrorMessage("Error removing movement: " + data.data);
        }
    };

    return (
        <main className="container p-4">
            <h1>Manage Movements for Nurmon</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <Form.Group className="mb-3">
                <Form.Label>Add Movement</Form.Label>
                <CustomComboBox<MovementDataDTO>
                    dataSource={allMovements}
                    textField="name"
                    valueField="id"
                    selectedValue={selectedMovementId}
                    onChange={(val) => setSelectedMovementId(val as number)}
                />
                <Button className="mt-2" onClick={handleAddMovement} disabled={!selectedMovementId}>Add</Button>
            </Form.Group>

            <h4 className="mt-4">Assigned Movements</h4>
            <ul className="list-group">
                {assignedMovements.map((entry : NurmonMovementDataDTO) => (
                    <li key={entry.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{entry.movement.name} | {entry.movement.is_physical ? 'Physical' : 'Special'} | {entry.movement.type?.name} | (Power: {entry.movement.power})</span>
                        <Button variant="danger" size="sm" onClick={() => handleRemoveMovement(entry.id)}>Remove</Button>
                    </li>
                ))}
                {assignedMovements.length === 0 && <li className="list-group-item">No movements assigned.</li>}
            </ul>
        </main>
    );
};

export default NurmonMovementsFormView;
