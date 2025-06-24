import { useEffect, useState } from "react";
import global_vars from "../../../global/global_vars";
import CustomNavBar from "../../components/CustomNavbar";
import { useAuth } from "../../hooks/useAuth";
import type { TeamDataDTO } from "../../types/types";
import { Link } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";

const MainView = () => {

    const { getToken, getCurrentUserId } = useAuth();
    const [myTeams, setMyTeams] = useState<TeamDataDTO[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [showModal, setShowModal] = useState<boolean>(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const [newTeamName, setNewTeamName] = useState<string>("");

    useEffect(() => {
        fetchMyTeams();
    }, []);

    const handleCreateTeam = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newTeamName.trim()) {
            setErrorMessage("Team name cannot be empty.");
            return;
        }

        const teamData = {
            name : newTeamName,
            user_id : getCurrentUserId()
        }

        try {
            const response = await fetch(`${global_vars.API_URL}/teams/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(teamData)
            });

            const data = await response.json();
            if (response.ok) {
                setMyTeams((prevTeams) => [...prevTeams, data]);
                setNewTeamName("");
                handleClose();
            } else {
                console.error(data);
                setErrorMessage(data.data || data.message || 'Failed to create team');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("An unexpected error occurred while creating the team.");
        }
    }

    const fetchMyTeams = async () => {
        try {
            const response = await fetch(`${global_vars.API_URL}/teams/my`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setMyTeams(data);
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
            <main className="container my-4">
                <h1 className="mb-4 text-center">My Teams</h1>

                <button className="btn btn-primary m-3" onClick={handleShow}>
                    Create New Team
                </button>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {myTeams.length === 0 && (
                    <div className="text-center text-muted">You haven’t created any teams yet.</div>
                )}

                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {myTeams.map((team) => (
                        <div key={team.id} className="col">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column">
                                    <h4 className="card-title text-center mb-3">{team.name}</h4>

                                    {team.teamMembers && team.teamMembers.length === 0 ? (
                                        <p className="text-muted text-center flex-grow-1">This team has no members yet.</p>
                                    ) : (
                                        <div className="d-flex justify-content-center flex-wrap gap-4 mb-3">
                                            {team.teamMembers && team.teamMembers.map((member) => (
                                                <div key={member.id} className="text-center">
                                                    <img
                                                        src={`${global_vars.UPLOADS_URL}/nurmon/${member.nurmon?.image_path}`}
                                                        alt={member.nurmon?.name}
                                                        className="rounded-circle mb-2"
                                                        style={{ width: "60px", height: "60px", objectFit: "cover", border: "2px solid #dee2e6" }}
                                                    />
                                                    <p className="small mb-0">
                                                        {member.nickname || member.nurmon?.name}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="d-grid">
                                        <Link className="btn btn-outline-primary" to={`/teams/${team.id}`}>
                                            View Team
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateTeam}>
                        <Form.Group>
                            <Form.Label>Team Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter team name"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)} />
                        </Form.Group>
                        <Modal.Footer>
                            <Form.Group>
                                <button className="btn btn-primary">Create Team</button>
                            </Form.Group>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default MainView;
