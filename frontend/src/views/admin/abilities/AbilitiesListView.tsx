import { Link } from "react-router-dom"
import AdminNavbar from "../../../components/admin/AdminNavbar"
import { useAuth } from "../../../hooks/useAuth"
import { useEffect, useState } from "react";
import type { AbilityDataDTO } from "../../../types/types";
import global_vars from "../../../../global/global_vars";



const AbilitiesListView = () => {

    const { getToken } = useAuth();

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [abilities, setAbilities] = useState<AbilityDataDTO[]>([]);

    const fetchAbilities = async () => {
        try {
            const response = await fetch(`${global_vars.API_URL}/abilities`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch abilities');
            }

            const data = await response.json();
            console.log("Fetched abilities:", data);
            setAbilities(data);
        } catch (error) {
            console.log("Error fetching abilities:", error);
            setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    }

    useEffect(() => {
        fetchAbilities();
    }, [])

    return (
        <>
        <AdminNavbar />
        <main className="container">
            <h1>Abilities List</h1>
            <Link to="/admin/abilities/form" className="btn btn-primary mb-3">Create a Ability</Link>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="container">
                <table className="table table-striped text-center">
                    <thead>
                        <tr>
                            <th>Ability ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {abilities.map((ability : AbilityDataDTO) => (
                            <tr key={ability.id}>
                                <td style={{maxWidth: "200px"}}>{ability.id}</td>
                                <td style={{maxWidth: "200px"}}>{ability.name}</td>
                                <td style={{maxWidth: "200px"}}>{ability.description}</td>
                                <td>
                                    <Link to={`/admin/abilities/form/${ability.id}`} className="btn btn-outline-primary">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    </>
    )
}

export default AbilitiesListView;