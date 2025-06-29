import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { MemberNurmonMovementDataDTO } from "../../types/types";
import { Col, Row } from "react-bootstrap";
import global_vars from "../../../global/global_vars";
import IndividualMemberMovementComponent from "./IndividualMemberMovementComponent";

type MemberMovementsComponentProps = {
    memberId? : number;
    teamId? : number;
    nurmonId? : number;
}

const MemberMovementsComponent = (props : MemberMovementsComponentProps) => {

    const { getToken } = useAuth();

    const [currentMemberNurmonMovements, setCurrentMemberNurmonMovements] = useState<MemberNurmonMovementDataDTO[]>([]);
    const [render, setRender] = useState<boolean>(false);

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
                    </Row>
                )}
            </div>
        </>
    );
}

export default MemberMovementsComponent;