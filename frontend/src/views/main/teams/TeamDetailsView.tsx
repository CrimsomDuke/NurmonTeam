import { useEffect, useState } from "react";
import CustomNavBar from "../../../components/CustomNavbar";
import { useAuth } from "../../../hooks/useAuth";
import type { TeamMemberDataDTO } from "../../../types/types";
import global_vars from "../../../../global/global_vars";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";
import SearchableComboBox from "../../../components/SearcheableComboBox";



const TeamDetailsView = () => {

    const params = useParams();
    const navigate = useNavigate();

    const { getToken } = useAuth();
    const [teamName, setTeamName] = useState<string>("")
    const [teamMembers, setTeamMembers] = useState<TeamMemberDataDTO[]>([]);

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [showModal, setShowModal] = useState<boolean>(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const [selectedNurmonId, setSelectedNurmonId] = useState<number | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchMyTeams();
        }
    }, [params.id]);

    useEffect(() => {
        if (teamName) {
            fetchTeamMembers(parseInt(params.id!));
        }
    }, [teamName]);

    const handleAddNurmonToTeam = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedNurmonId) {
            setErrorMessage("Please select a Nurmon to add to the team.");
            return;
        }

        if(!params.id){
            setErrorMessage("Team ID is not available.");
            return;
        }

        try{
            const teamMemberData : TeamMemberDataDTO = {
                team_id: parseInt(params.id!),
                nurmon_id: selectedNurmonId,
            }

            const response = await fetch(`${global_vars.API_URL}/team_members/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(teamMemberData)
            });

            const data = await response.json();
            if (response.ok) {
                navigate(`/teams/${params.id}`);
            } else {
                console.error(data);
                setErrorMessage(data.data || data.message || 'Failed to add Nurmon to team');
            }
        }catch(err){
            console.error(err);
            setErrorMessage("An unexpected error occurred while adding Nurmon to the team.");
        }
    }

    const fetchTeamMembers = async (teamId: number) => {
        try {
            const response = await fetch(`${global_vars.API_URL}/team_members/team/${teamId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setTeamMembers(data);
                console.log(data)
            } else {
                console.error(data);
                setErrorMessage(data.data || data.message || 'Failed to fetch team members');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("An unexpected error occurred while fetching team members.");
        }
    }

    const fetchMyTeams = async () => {
        try {
            const response = await fetch(`${global_vars.API_URL}/teams/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setTeamName(data.name);
                console.log(data);
            } else {
                console.error(data);
                setErrorMessage(data.data || data.message || 'Failed to fetch teams');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("An unexpected error occurred while fetching teams.");
        }
    };

    return (
        <>
            <CustomNavBar />
            <main className="container">
                <h1 className="text-center">Team Details</h1>
                <Link to="/" className="btn btn-secondary mb-3">Back to my teams</Link>
                {errorMessage && (<p className="text-danger">{errorMessage}</p>)}
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">{teamName}</h2>
                    </div>

                    {teamMembers && teamMembers.length >= 0 ? (
                        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-3 g-4">
                            {teamMembers.map((member) => (
                                <Link key={member.id} className="team-container col text-decoration-none"
                                    to={`/team_member/${member.id}`}>
                                    <div className="card h-100 shadow-sm border-0">
                                        <img
                                            src={`${global_vars.UPLOADS_URL}/nurmon/${member.nurmon?.image_path}`}
                                            className="card-img-top mx-auto d-block mt-3 rounded-circle"
                                            alt={member.nurmon?.name}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body text-center">
                                            <h5 className="card-title mb-1">{member.nickname || member.nurmon?.name}</h5>
                                            <p className="text-muted small mb-1">{member.nurmon?.type?.name || 'No Type'}</p>
                                            <p className="text-muted small">{member.nature?.name || 'No Nature'}</p>
                                            <div className="mt-2">
                                                <span className="badge bg-primary me-1">HP: {member.nurmon?.hp}</span>
                                                <span className="badge bg-success me-1">ATK: {member.nurmon?.attack}</span>
                                                <span className="badge bg-danger">SPD: {member.nurmon?.speed}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted">This team has no members.</p>
                    )}

                    {teamMembers &&teamMembers.length < 6 && (
                        <button className="btn btn-primary m-3" onClick={handleShow}>Add Team Member</button>       
                    )}
                </div>
            </main>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Adding Nurmon to Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddNurmonToTeam}>
                        <Form.Group>
                            <Form.Label>Select the Nurmon</Form.Label>
                            <SearchableComboBox
                                endpoint={`${global_vars.API_URL}/nurmons/search`}
                                textField="name"
                                valueField="id"
                                folder_name="nurmon"
                                image_field="image_path"
                                placeholder="Search for a Nurmon"
                                onSelect={(item) => {
                                    setSelectedNurmonId(item.id);
                                }}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Form.Group>
                                <button className="btn btn-primary">Add Nurmon to Team</button>
                            </Form.Group>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default TeamDetailsView;