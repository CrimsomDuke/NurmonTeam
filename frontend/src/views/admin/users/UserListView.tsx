import { useEffect, useState } from "react";
import global_vars from "../../../../global/global_vars";
import { useAuth } from "../../../hooks/useAuth";
import AdminNavbar from "../../../components/admin/AdminNavbar";
import type { UserDataDTO } from "../../../types/types";
import { Link } from "react-router-dom";

const UsersListView = () => {

    const { getToken } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [users, setUsers] = useState<UserDataDTO[]>([]);

    useEffect(() => {
        fetchUsers();
        console.log(getToken());
    }, [])

    const fetchUsers = async () => {
        try{
            const response = await fetch(`${global_vars.API_URL}/users`, {
                method: 'GET',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${getToken()}`
                }
            });

            const data = await response.json();
            if (response.ok){
                setUsers(data);
            }else{
                console.log("Failed to fetch users:", data);
                setErrorMessage("Failed to fetch users. Please try again later.");
            }
        }catch(error){
            console.log("Error fetching users:", error);
            setErrorMessage("Failed to fetch users. Please try again later.");
        }
    }


    return (
        <>
            <AdminNavbar />
            <main className="container">
                <h1>Users List</h1>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">Username</th>
                                <th className="text-center">Email</th>
                                <th className="text-center">Is Admin</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="text-center">{user.username}</td>
                                    <td className="text-center">{user.email}</td>
                                    <td className="text-center">{user.is_admin ? 'Yes' : 'No'}</td>
                                    <td className="text-center">
                                        <Link className="btn btn-primary" to={`/admin/users/form/${user.id}`}>Edit</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <style>
            </style>
        </>
    );
}

export default UsersListView;