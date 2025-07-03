import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/admin/AdminNavbar";
import global_vars from "../../../../global/global_vars";
import type { MovementDataDTO } from "../../../types/types";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";


const MovementsListView = () => {

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [movements, setMovements] = useState([]);

    const { getToken } = useAuth();

    
    useEffect(() => {
        fetchMovements();
    }, [])

    const fetchMovements = async () => {
        try{
            const response = await fetch(`${global_vars.API_URL}/movements`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            })

            const data = await response.json();
            if (response.ok) {
                console.log("Movements fetched successfully:", data);
                setMovements(data);
            } else {
                console.log("Failed to fetch movements:", data);
                setErrorMessage("Failed to fetch movements. Please try again later.");
            }
        }catch(error){
            console.log("Error fetching movements:", error);
            setErrorMessage("An error occurred while fetching movements. Please try again later.");
        }

    }

    return (
        <>
            <AdminNavbar />
            <main className="container">
                <h1>Movements List</h1>
                <Link to="/admin/movements/form" className="btn btn-primary mb-3">Create a Movement</Link>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="container">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Movement ID</th>
                                <th>Name</th>
                                <th>Power</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map((movement : MovementDataDTO) => (
                                <tr key={movement.id}>
                                    <td>{movement.id}</td>
                                    <td>{movement.name}</td>
                                    <td>{movement.power}</td>
                                    <td>{movement.type!.name}</td>
                                    <td>{movement.is_physical === true ? 'Physical' : 'Special' }</td>
                                    <td>
                                        <Link to={`/admin/movements/form/${movement.id}`} className="btn btn-outline-primary">
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
  );
}

export default MovementsListView;