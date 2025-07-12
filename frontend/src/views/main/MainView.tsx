import { useEffect, useState } from "react";
import global_vars from "../../../global/global_vars";
import CustomNavBar from "../../components/shared/CustomNavbar";
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

    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [teamName, setTeamName] = useState<string>("");
    const [reload, setReload] = useState<boolean>(false);

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const handleCloseEditModal = () => { setShowEditModal(false); setSelectedTeamId(null); setTeamName(""); };
    const handleShowEditModal = () => { setShowEditModal(true) };

    const [newTeamName, setNewTeamName] = useState<string>("");

    useEffect(() => {
        fetchMyTeams();
    }, []);

    useEffect(() => {
        if (reload) {
            fetchMyTeams();
            setReload(false);
        }
    }, [reload]);

    const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newTeamName.trim()) {
            setErrorMessage("Team name cannot be empty.");
            return;
        }

        const teamData = {
            name: newTeamName,
            user_id: getCurrentUserId()
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

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch(`${global_vars.API_URL}/teams/update/${selectedTeamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ name: teamName })
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Update");
            console.log(data)
            setReload(true);
            handleCloseEditModal();
        } else {
            setErrorMessage(data.data || data.message || 'Failed to update team');
            console.error(data);
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
            <main className="container my-4 my-lg-5">
                <div className="text-center mb-4 mb-lg-5">
                    <h1 className="display-5 fw-bold mb-3">My Teams</h1>
                    <button
                        className="btn btn-primary px-4 py-2 fw-medium"
                        onClick={handleShow}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Create New Team
                    </button>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger mx-auto" style={{ maxWidth: '600px' }}>
                        {errorMessage}
                    </div>
                )}

                {myTeams.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <i className="bi bi-people" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
                        </div>
                        <h4 className="text-muted mb-4">You haven't created any teams yet</h4>
                        <button
                            className="btn btn-primary px-4 py-2"
                            onClick={handleShow}
                        >
                            Create Your First Team
                        </button>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
                        {myTeams.map((team) => (
                            <div key={team.id} className="col">
                                <div className="card h-100 border-0 shadow-lg overflow-hidden team-card">
                                    <div className="card-body d-flex flex-column p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h3 className="card-title mb-0 fw-semibold text-truncate">
                                                {team.name}
                                            </h3>
                                            <span className="badge bg-light text-dark">
                                                {team.teamMembers?.length || 0}/6 members
                                            </span>
                                        </div>

                                        {team.teamMembers && team.teamMembers.length === 0 ? (
                                            <div className="text-center py-4 flex-grow-1">
                                                <i className="bi bi-emoji-frown" style={{ fontSize: '2rem', color: '#dee2e6' }}></i>
                                                <p className="text-muted mt-2 mb-0">This team has no members yet</p>
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-center flex-wrap gap-3 mb-4" style={{ flexGrow: 1 }}>
                                                {team.teamMembers && team.teamMembers.map((member) => (
                                                    <div key={member.id} className="text-center team-member">
                                                        <div className="position-relative">
                                                            <img
                                                                src={`${global_vars.UPLOADS_URL}/nurmon/${member.nurmon?.image_path}`}
                                                                alt={member.nurmon?.name}
                                                                className="rounded-circle border border-3 border-white shadow-lg"
                                                                style={{
                                                                    width: "80px",
                                                                    height: "80px",
                                                                    objectFit: "cover",
                                                                    transition: 'transform 0.3s ease'
                                                                }}
                                                            />
                                                        </div>
                                                        <p className="small mt-2 mb-0 fw-medium text-truncate" style={{ maxWidth: '80px' }}>
                                                            {member.nickname || member.nurmon?.name}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="d-flex gap-2 mt-auto">
                                            <Link
                                                className="btn btn-outline-primary flex-grow-1"
                                                to={`/teams/${team.id}`}
                                            >
                                                <i className="bi bi-eye me-1"></i> View
                                            </Link>
                                            <button
                                                className="btn btn-outline-secondary flex-grow-1"
                                                onClick={() => {
                                                    setSelectedTeamId(team.id);
                                                    setTeamName(team.name);
                                                    handleShowEditModal();
                                                }}
                                            >
                                                <i className="bi bi-pencil me-1"></i> Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Team Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Create New Team</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <Form onSubmit={handleCreateTeam}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold mb-2">Team Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter team name"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                className="py-2"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-3"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                            >
                                Create Team
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Team Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Edit Team Name</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold mb-2">Team Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter team name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="py-2"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-3"
                                onClick={handleCloseEditModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                            >
                                Save Changes
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`
        .team-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 12px;
        }
        
        .team-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .team-member:hover img {
            transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
            .card-title {
                font-size: 1.25rem;
            }
        }
    `}</style>
        </>

    );
};

export default MainView;
