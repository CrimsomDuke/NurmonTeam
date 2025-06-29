import { Button, Modal } from "react-bootstrap";
import type { NurmonMovementDataDTO } from "../../types/types";
import global_vars from "../../../global/global_vars";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ExtendedSearchableComboBox from "../shared/ExtendedSearcheableComboBox";

interface IndividualMemberMovementComponentProps {
    memberId : number;
    nurmonId : number;
    memberNurmonMovementId? : number;
    nurmonMovementObject? : NurmonMovementDataDTO | null;
    onMovementSelected?: (movementId: number) => void;
    onMovementSaved?: (movementId: number) => void;
}

const IndividualMemberMovementComponent = (props : IndividualMemberMovementComponentProps) => {

    const { getToken } = useAuth();

    const [showMovementModal, setShowMovementModal] = useState(false);
    const handleModalMovementClose = () => setShowMovementModal(false);
    const handleModalMovementShow = () => setShowMovementModal(true);

    const [newSelectedNurmonMovement, setNewSelectedNurmonMovement] = useState<NurmonMovementDataDTO | null>(null);

    const handleMemberMovementUpdate = async () => {
        if (!props.memberId || !props.memberNurmonMovementId){
            alert("Member ID, Team ID, and Nurmon ID are required to update the movement.");
            return;
        }
        if(!newSelectedNurmonMovement){
            console.log("edit but not selected")
            return;
        }

        try{
            const body = {
                team_member_id: props.memberId,
                nurmon_movement_id: newSelectedNurmonMovement.id,
            }
            const response = await fetch(`${global_vars.API_URL}/member_nurmon_movements/update/${props.memberNurmonMovementId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Movement updated successfully:", data);
                if (props.onMovementSaved) {
                    props.onMovementSaved(data.id);
                }

                handleModalMovementClose();
            } else {
                console.error("Failed to update member movement");
                alert("Failed to update member movement. Please try again later.");
            }
        }catch(err){
            console.error("Error updating member movement:", err);
            alert("Failed to update member movement. Please try again later.");
        }
    }

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">Movement Details</h5>
                {props.nurmonMovementObject ? (
                    <>
                        <p><strong>Name:</strong> {props.nurmonMovementObject.movement.name}</p>
                        <p><strong>Type:</strong> {props.nurmonMovementObject.movement.type?.name}</p>
                        <p><strong>Power:</strong> {props.nurmonMovementObject.movement.power}</p>
                    </>
                ) : (
                    <p>No movement selected.</p>
                )}
                <Button variant="primary" onClick={handleModalMovementShow}>
                    Select Movement
                </Button>
            </div>

            <Modal show={showMovementModal} onHide={handleModalMovementClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecte the Movement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ExtendedSearchableComboBox<NurmonMovementDataDTO>
                        endpoint={`${global_vars.API_URL}/nurmon_movements/search/nurmon/${props.nurmonId}`}
                        textSelector={(item) => item.movement.name}
                        valueSelector={(item) => item.id}
                        searchOnEmptyQuery={true}
                        folder_name="item"
                        placeholder="Select the movement"
                        additionalFieldsSelectors={[
                            (item) => `Type: ${item.movement.type?.name || "No Type"}`,
                            (item) => `Power: ${item.movement.power}`,
                            (item) => 'Category: ' + (item.movement.is_physical ? 'Physical' : 'Special'),
                        ]}
                        onSelect={(item) => {
                            setNewSelectedNurmonMovement(item);
                            if(props.onMovementSelected) {
                                props.onMovementSelected(item.id);
                            }
                        }}
                    />
                    <Button className="btn btn-primary m-3" onClick={handleMemberMovementUpdate}>Save</Button>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default IndividualMemberMovementComponent;