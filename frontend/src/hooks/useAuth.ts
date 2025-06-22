
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import global_vars from '../../global/global_vars';

export const useAuth = (shouldRedirect : boolean = true) => {

    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAuth must be used within an AppProvider");
    }

    const { setUserInfo, removeUserInfo } = context;

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {

        console.log("Esta auth", isAuthenticated)

        if(!isAuthenticated && shouldRedirect){
            console.log("USUARIO NO AUTENTICADO, REDIRIGIENDO A LOGIN")
            navigate("/auth/login");
        }else{
            fetchUserInfo();
        }
    }, [isAuthenticated])

    const fetchUserInfo = async () => {
        console.log("OBTENIENDO INFO DEL USUARIO")
        try{
            const response = await fetch(`${global_vars.API_URL}/users/me`, {
                method : 'GET',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            })

            const data = await response.json();
            if(response.ok) {
                setUserInfo(data);
                console.log("USUARIO AUTENTICADO:", data);
                if(data.is_admin){
                    setIsUserAdmin(true);

                    localStorage.setItem(global_vars.LOCAL_STORAGE_IS_USER_ADMIN, "true");
                }
            } else {
                console.error("Failed to fetch user info:", data.error);
                removeUserInfo();
                navigate('/auth/login');
            }
        }catch(error){
            console.error("Error fetching user info:", error);
            removeUserInfo();
            setIsAuthenticated(false);
            navigate('/auth/login');
        }
    }

     const logout = () => {
        localStorage.removeItem(global_vars.LOCAL_STORAGE_TOKEN);
        localStorage.removeItem(global_vars.LOCAL_STORAGE_IS_USER_ADMIN);
        removeUserInfo();
        setIsAuthenticated(false);
        navigate('/auth/login');
    }

    const saveToken = (token : string) => {
        localStorage.setItem(global_vars.LOCAL_STORAGE_TOKEN, token);
        setIsAuthenticated(true);
    }

    const getToken = () => {
        return localStorage.getItem(global_vars.LOCAL_STORAGE_TOKEN);
    }

    const isCurrentUserAdmin = () => {
        return localStorage.getItem(global_vars.LOCAL_STORAGE_IS_USER_ADMIN) == 'true';
    }

    return {
        isAuthenticated, logout, saveToken, getToken, isCurrentUserAdmin
    }

}