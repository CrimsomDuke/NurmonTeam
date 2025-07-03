import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/admin/AdminNavbar";
import global_vars from "../../../../global/global_vars";
import type { NurmonDataDTO } from "../../../types/types";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";


const NurmonsListView = () => {
    
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [nurmons, setNurmons] = useState<NurmonDataDTO[]>([])

    const { getToken } = useAuth();

    useEffect(() => {
        fetchNurmons();
    }, [])

    const fetchNurmons = async () => {
        try{
            const response = await fetch(`${global_vars.API_URL}/nurmons`, {
                method : 'GET',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            const data = await response.json();
            if(response.ok){
                console.log("Nurmons fetched successfully:")
                setNurmons(data);
            }else{
                console.log("Failed to fetch nurmons:", data);
                setErrorMessage("Failed to fetch nurmons. Please try again later.");
            }

        }catch(error){
            console.log("Error fetching nurmons:", error);
        }
    }

    return (
        <>
            <AdminNavbar />
            <main className="container ">
                <h1>Nurmons List</h1>
                <Link to="/admin/nurmons/form" className="btn btn-primary mb-3">Create a Nurmon</Link>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {nurmons.map(nurmon => (
                        <div key={nurmon.id} className="col">
                            <div className="card h-100 shadow-sm border-0">
                                {nurmon.image_path && (
                                    <img src={global_vars.UPLOADS_URL + "/nurmon/" + nurmon.image_path + `?t=${new Date().getTime()}`} alt={nurmon.name} className="card-img-top" style={{ objectFit: "cover", height: "200px" }} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{nurmon.name}</h5>
                                    <span className="badge bg-primary mb-2">{nurmon.type?.name || "Unknown Type"}</span>
                                    <ul className="list-group list-group-flush my-2">
                                        <li className="list-group-item"><strong>HP:</strong> {nurmon.hp}</li>
                                        <li className="list-group-item"><strong>Attack:</strong> {nurmon.attack}</li>
                                        <li className="list-group-item"><strong>Defense:</strong> {nurmon.def}</li>
                                        <li className="list-group-item"><strong>Sp. Atk:</strong> {nurmon.special_attack}</li>
                                        <li className="list-group-item"><strong>Sp. Def:</strong> {nurmon.special_def}</li>
                                        <li className="list-group-item"><strong>Speed:</strong> {nurmon.speed}</li>
                                    </ul>
                                </div>
                                <div className="card-footer bg-transparent border-top-0 text-center">
                                    <Link to={`/admin/nurmons/form/${nurmon.id}`} className="btn btn-outline-primary w-100">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}

export default NurmonsListView;