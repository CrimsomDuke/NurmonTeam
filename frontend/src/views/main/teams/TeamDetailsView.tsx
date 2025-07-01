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

            <main className="container py-5">
                <div className="text-center mb-4">
                    <h1 className="fw-bold">Team Details</h1>
                    <Link to="/" className="btn btn-outline-secondary mt-2">← Back to My Teams</Link>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger text-center">{errorMessage}</div>
                )}

                <div className="bg-light p-4 rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-semibold mb-0">{teamName}</h2>
                        {teamMembers?.length < 6 && (
                            <div>
                                <button className="btn btn-sm btn-primary me-2" onClick={handleShow}>
                                    + Add Team Member
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                        confirm("Delete Team?") ? handleDelete() : console.log("Deletion cancelled")
                                    }
                                >
                                    x Delete Team
                                </button>
                            </div>
                        )}
                    </div>

                    {teamMembers?.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            {teamMembers.map((member) => (
                                <div className="col team-container" key={member.id}>
                                    <Link to={`/team_member/${member.id}`} className="text-decoration-none text-dark">
                                        <div className="card border-0 shadow-sm h-100 text-center hover-shadow">
                                            <div className="pt-3">
                                                <img
                                                    src={`${global_vars.UPLOADS_URL}/nurmon/${member.nurmon?.image_path}`}
                                                    alt={member.nurmon?.name}
                                                    className="rounded-circle border"
                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                />
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title">{member.nickname || member.nurmon?.name}</h5>
                                                <p className="text-muted small mb-1">{member.nurmon?.type?.name || 'No Type'}</p>
                                                <p className="text-muted small">{member.nature?.name || 'No Nature'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted mt-4">This team has no members yet.</p>
                    )}
                </div>
            </main>

            {/* Modal for adding Nurmon */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Nurmon to Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddNurmonToTeam}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Select a Nurmon</Form.Label>
                            <SearchableComboBox
                                endpoint={`${global_vars.API_URL}/nurmons/search`}
                                textField="name"
                                valueField="id"
                                folder_name="nurmon"
                                image_field="image_path"
                                placeholder="Search for a Nurmon"
                                onSelect={(item) => setSelectedNurmonId(item.id)}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-success">
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