import { useEffect, useState } from "react";
import global_vars from "../../../../global/global_vars";
import CustomNavBar from "../../../components/shared/CustomNavbar"
import { useAuth } from "../../../hooks/useAuth";
import type { TeamMemberDataDTO } from "../../../types/types";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";

import 'react-edit-text/dist/index.css';
import { EditText } from "react-edit-text";
import MemberItemAbilityComponent from "../../../components/main/MemberItemAbilityComponent";
import MemberMovementsComponent from "../../../components/main/MemberMovementsComponent";


const TeamMemberView = () => {

    const { getToken } = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    const [teamMemberData, setTeamMemberData] = useState<TeamMemberDataDTO | null>(null);
    const [teamMemberName, setTeamMemberName] = useState<string>('');

    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        // Fetch team member data if needed
        if (params.id) {
            fetchTeamMemberData();
        }
    }, [params.id]);

    const fetchTeamMemberData = async () => {
        try{
            const response = await fetch(`${global_vars.API_URL}/team_members/${params.id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                }
            });
        
            const data = await response.json();
            if (response.ok) {
                setTeamMemberData(data);
                setTeamMemberName(data.nickname || "Unknown Team Member");
            } else {
                console.error("Failed to fetch team member data:", data);
                setErrorMessage("Failed to fetch team member data. Please try again later.");
            }

        }catch(err){
            console.error("Error fetching team member data:", err);
            setErrorMessage("Failed to fetch team member data. Please try again later.");
        }
    }

    const updateTeamMemberName = async () => {
        if (!teamMemberData) return;
        if (teamMemberName.trim() === "") {
            setErrorMessage("Team member name cannot be empty.");
            setTeamMemberName(prevState => prevState ? prevState : teamMemberData.nurmon.name);
            return;
        }
        try {

            const body = {
                nickname : teamMemberName,
                team_id : teamMemberData.team_id,
                nurmon_id : teamMemberData.nurmon_id
            }

            const response = await fetch(`${global_vars.API_URL}/team_members/update/${teamMemberData.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const updatedData = await response.json();
                console.log("Team member name updated successfully:", updatedData);
                setErrorMessage(""); // Clear any previous error messages
            } else {
                const data = await response.json();
                console.error("Failed to update team member name:", data);
                setErrorMessage("Failed to update team member name. Please try again later.");
            }
        } catch (err) {
            console.error("Error updating team member name:", err);
            setErrorMessage("Failed to update team member name. Please try again later.");
        }
    }

    const handleDeleteTeamMember = async () => {
        if(!teamMemberData) return;

        const team_id = teamMemberData.team_id;
        const response = await fetch(`${global_vars.API_URL}/team_members/delete/${teamMemberData.id}`, {
            method: 'DELETE',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${getToken()}`
            }
        });

        const data = await response.json();
        if (response.ok){
            alert('Team member deleted');
            navigate(`/teams/${team_id}`)
        }else{
            setErrorMessage(data.data || data.error || 'Error while deleting Team Mmeber')
            return;
        }
    }
    
    return (
        <>
            <CustomNavBar />
            <main className="container"> 
                <h1>Team Member Details</h1>
                <div className="d-flex justify-content-between">
                    {teamMemberData ? (
                        <Link to={`/teams/${teamMemberData.team_id}`} className="btn btn-secondary">Back to Team</Link>
                    ) : (<p>No team id</p>)}

                    <Button className="btn btn-danger" onClick={handleDeleteTeamMember}>
                        Delete Team Member
                    </Button>
                </div>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <div className="card mt-3">
                    <div className="card-body">
                        <Row>
                            <Col md={5}>
                                <EditText value={teamMemberName}  
                                    onChange={(e) => {setTeamMemberName(e.target.value);}}
                                    onSave={updateTeamMemberName}
                                    showEditButton/>
                                {teamMemberData?.nurmon.image_path && (
                                    <div className="d-flex justify-content-center mb-3">
                                        <img src={`${global_vars.UPLOADS_URL}/nurmon/${teamMemberData.nurmon.image_path}?t=${new Date().getTime()}`} 
                                        alt={teamMemberName} className="img-fluid" style={{ maxWidth: "300px"  }} />
                                    </div>
                                )}
                                <div className="text-center">
                                    <h4>Type: {teamMemberData?.nurmon.type?.name}</h4>
                                </div>
                            </Col>
                            <Col md={7}>
                                <MemberItemAbilityComponent 
                                    teamMemberId={teamMemberData?.id || 0}
                                    teamId={teamMemberData?.team_id || 0}
                                    nurmonId={teamMemberData?.nurmon_id || 0}
                                    itemId={teamMemberData?.item_id || 0}
                                    selectedAbilityId={teamMemberData?.selected_ability_id || 0} 
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} className="mt-3">
                                <MemberMovementsComponent
                                    memberId={teamMemberData?.id || 0}
                                    teamId={teamMemberData?.team_id || 0}
                                    nurmonId={teamMemberData?.nurmon_id || 0}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            </main>
        </>
    )
}

export default TeamMemberView;