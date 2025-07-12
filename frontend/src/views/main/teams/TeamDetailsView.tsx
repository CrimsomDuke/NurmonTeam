import { useEffect, useState } from "react";
import CustomNavBar from "../../../components/shared/CustomNavbar";
import { useAuth } from "../../../hooks/useAuth";
import type { TeamMemberDataDTO } from "../../../types/types";
import global_vars from "../../../../global/global_vars";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";
import SearchableComboBox from "../../../components/shared/SearcheableComboBox";



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

    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        if (params.id) {
            fetchMyTeams();
        }
    }, [params.id]);

    useEffect(() => {
        if (reload) {
            fetchTeamMembers(parseInt(params.id!));
            setReload(false);
        }
    }, [reload]);

    useEffect(() => {
        if (teamName) {
            fetchTeamMembers(parseInt(params.id!));
        }
    }, [teamName]);

    const handleAddNurmonToTeam = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedNurmonId) {
            setErrorMessage("Please select a Nurmon to add to the team.");
            return;
        }

        if (!params.id) {
            setErrorMessage("Team ID is not available.");
            return;
        }

        try {
            const teamMemberData = {
                team_id: parseInt(params.id!),
                nurmon_id: selectedNurmonId,

                hp_ev: 0,
                attack_ev: 0,
                def_ev: 0,
                special_attack_ev: 0,
                special_def_ev: 0,
                speed_ev: 0,

                hp_iv: 0,
                attack_iv: 0,
                def_iv: 0,
                special_attack_iv: 0,
                special_def_iv: 0,
                speed_iv: 0
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
                console.log("Shit created");
                setReload(true);
                handleClose();
            } else {
                console.error(data);
                setErrorMessage(data.data || data.message || 'Failed to add Nurmon to team');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("An unexpected error occurred while adding Nurmon to the team.");
        }
    }

    const handleDelete = async () => {
        if (!params.id) {
            setErrorMessage("Can't delete a team without ID");
            return;
        }

        const response = await fetch(`${global_vars.API_URL}/teams/delete/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            navigate('/');
            console.log("Team deleted successfully");
        } else {
            setErrorMessage(data.data || data.message || 'Failed to delete team');
            console.error(data);
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

            <main className="container py-4 py-md-5">
                <div className="text-center mb-4 mb-md-5">
                    <h1 className="display-5 fw-bold mb-3">Team Details</h1>
                    <Link to="/" className="btn btn-outline-primary mt-2">
                        ← Back to My Teams
                    </Link>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: '600px' }}>
                        {errorMessage}
                    </div>
                )}

                <div className="bg-white p-4 p-md-5 rounded-3 shadow-sm">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pb-2 border-bottom">
                        <h2 className="fw-semibold mb-3 mb-md-0">
                            {teamName}
                            <span className="text-muted fs-6 ms-2">
                                ({teamMembers?.length || 0}/6 members)
                            </span>
                        </h2>
                        {teamMembers?.length < 6 && (
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary" onClick={handleShow}>
                                    <i className="bi bi-plus-lg me-1"></i> Add Member
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() =>
                                        window.confirm("Are you sure you want to delete this team?")
                                            ? handleDelete()
                                            : null
                                    }
                                >
                                    <i className="bi bi-trash me-1"></i> Delete Team
                                </button>
                            </div>
                        )}
                    </div>

                    {teamMembers?.length > 0 ? (
                        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-4 g-3">
                            {teamMembers.map((member) => (
                                <div className="col team-container" key={member.id}>
                                    <Link to={`/team_member/${member.id}`} className="text-decoration-none">
                                        <div className="card h-100 border-0 shadow-lg overflow-hidden">
                                            <div className="pt-4 px-4">
                                                <div className="position-relative" style={{ width: '120px', height: '120px', margin: '0 auto' }}>
                                                    <img
                                                        src={`${global_vars.UPLOADS_URL}/nurmon/${member.nurmon?.image_path}`}
                                                        alt={member.nurmon?.name}
                                                        className="rounded-circle img-fluid position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                                                        style={{ border: '3px solid white' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="card-body text-center pt-3">
                                                <h5 className="card-title mb-2">{member.nickname || member.nurmon?.name}</h5>
                                                <div className="d-flex justify-content-center gap-3">
                                                    <span className="badge bg-light text-dark">
                                                        {member.nurmon?.type?.name || 'No Type'}
                                                    </span>
                                                    <span className="badge bg-light text-dark">
                                                        {member.nature?.name || 'No Nature'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <i className="bi bi-people" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
                            </div>
                            <h4 className="text-muted mb-3">This team has no members yet</h4>
                            <button className="btn btn-primary" onClick={handleShow}>
                                Add Your First Team Member
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Nurmon Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Add Nurmon to Team</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <Form onSubmit={handleAddNurmonToTeam}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold mb-2">Select a Nurmon</Form.Label>
                            <SearchableComboBox
                                endpoint={`${global_vars.API_URL}/nurmons/search`}
                                textField="name"
                                valueField="id"
                                folder_name="nurmon"
                                image_field="image_path"
                                placeholder="Search for a Nurmon..."
                                onSelect={(item) => setSelectedNurmonId(item.id)}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-success px-4">
                                Add to Team
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default TeamDetailsView;