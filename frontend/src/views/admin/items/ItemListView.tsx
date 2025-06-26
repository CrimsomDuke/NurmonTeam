import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/admin/AdminNavbar";
import global_vars from "../../../../global/global_vars";
import type { ItemDataDTO } from "../../../types/types";
import { Link } from "react-router-dom";


const ItemsListView = () => {
    
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [items, setItems] = useState<ItemDataDTO[]>([])

    useEffect(() => {
        fetchItems();
    }, [])

    const fetchItems = async () => {
        try{
            const response = await fetch(`${global_vars.API_URL}/items`, {
                method : 'GET',
                headers : {
                    'Content-Type' : 'application/json'
                }
            });

            const data = await response.json();
            if(response.ok){
                console.log("Items fetched successfully:")
                setItems(data);
            }else{
                console.log("Failed to fetch Items:", data);
                setErrorMessage("Failed to fetch Items. Please try again later.");
            }

        }catch(error){
            console.log("Error fetching Items:", error);
        }
    }

    return (
        <>
            <AdminNavbar />
            <main className="container ">
                <h1>Items List</h1>
                <Link to="/admin/items/form" className="btn btn-primary mb-3">Create a Item</Link>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {items.map(item => (
                        <div key={item.id} className="col">
                            <div className="card h-100 shadow-sm border-0">
                                {item.image_path && (
                                    <img src={global_vars.UPLOADS_URL + "/item/" + item.image_path + `?t=${new Date().getTime()}`} alt={item.name} className="card-img-top" style={{ objectFit: "cover", height: "200px" }} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p>
                                        {item.description || "No description available."}
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent border-top-0 text-center">
                                    <Link to={`/admin/items/form/${item.id}`} className="btn btn-outline-primary w-100">
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

export default ItemsListView;