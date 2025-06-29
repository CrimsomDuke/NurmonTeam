import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { MemberNurmonMovementDataDTO, NurmonMovementDataDTO } from "../../types/types";
import { Button, Col, Modal, Row } from "react-bootstrap";
import global_vars from "../../../global/global_vars";
import IndividualMemberMovementComponent from "./IndividualMemberMovementComponent";
import ExtendedSearchableComboBox from "../shared/ExtendedSearcheableComboBox";

type MemberMovementsComponentProps = {
    memberId? : number;
    teamId? : number;
    nurmonId? : number;
}

const MemberMovementsComponent = (props : MemberMovementsComponentProps) => {

    const { getToken } = useAuth();

    const [currentMemberNurmonMovements, setCurrentMemberNurmonMovements] = useState<MemberNurmonMovementDataDTO[]>([]);
    const [render, setRender] = useState<boolean>(false);

    const [showCreateMovementModal, setShowCreateMovementModal] = useState<boolean>(false);
    const handleModalCreateMovementClose = () => setShowCreateMovementModal(false);
    const handleModalCreateMovementShow = () => setShowCreateMovementModal(true);

    const [newSelectedNurmonMovement, setNewSelectedNurmonMovement] = useState<NurmonMovementDataDTO | null>(null);

    useEffect(() => {
        fetchCurrentMemberMovements();
    }, [render])

    useEffect(() => {
        if(props.memberId){
            fetchCurrentMemberMovements();  
        }
    }, [props.memberId]);

    const fetchCurrentMemberMovements = async () =>{
        if (!props.memberId) return;

        try {
            const response = await fetch(`${global_vars.API_URL}/member_nurmon_movements/team_member/${props.memberId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentMemberNurmonMovements(data);
            } else {
                console.error("Failed to fetch current member movements");
            }
        } catch (error) {
            console.error("Error fetching current member movements:", error);
        }
    }

    const handleMemberMovementCreate = async () => {
        if (!props.memberId || !props.nurmonId) {
            alert("Member ID and Nurmon ID are required to create a movement.");
            return;
        }

        if (!newSelectedNurmonMovement) {
            console.log("No movement selected");
            return;
        }

        try {
            const body = {
                team_member_id: props.memberId,
                nurmon_movement_id: newSelectedNurmonMovement.id
            };
            const response = await fetch(`${global_vars.API_URL}/member_nurmon_movements/create`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Movement created successfully:", data);
                setRender(!render);
                handleModalCreateMovementClose();
            } else {
                console.error("Failed to create member movement");
                alert("Failed to create member movement. Please try again later. " + (data.data || ""));
            }
        } catch (error) {
            console.error("Error creating member movement:", error);
        }
    }

    return (
        <>
            <div className="">
                <h1 className="text-center">Member Movements</h1>

                {props.nurmonId && (
                    <Row>
                        {currentMemberNurmonMovements.map((memberNurmonMovement) => (
                            <Col key={memberNurmonMovement.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                                <IndividualMemberMovementComponent 
                                    memberId={props.memberId || 0}
                                    memberNurmonMovementId={memberNurmonMovement.id}
                                    nurmonId={props.nurmonId || 0}
                                    nurmonMovementObject={memberNurmonMovement.nurmonMovement}
                                    onMovementSelected={(movementId) => {
                                        console.log("Selected Movement ID:", movementId);
                                    }}
                                    onMovementSaved={(movementId) => {
                                        console.log("Movement saved with ID:", movementId);
                                        setRender(!render);
                                    }}
                                />
                            </Col>
                        ))}

                        {currentMemberNurmonMovements.length < 4 && (
                            <div>
                                <Button onClick={handleModalCreateMovementShow}>Agregar Movimiento</Button>
                            </div>
                        )}
                    </Row>
                )}
            </div>

            <Modal show={showCreateMovementModal} onHide={handleModalCreateMovementClose}>
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
                            console.log("Selected Movement ID:", item);
                            setNewSelectedNurmonMovement(item);
                        }}
                    />
                    <Button className="btn btn-primary m-3" onClick={handleMemberMovementCreate}>Save</Button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default MemberMovementsComponent;