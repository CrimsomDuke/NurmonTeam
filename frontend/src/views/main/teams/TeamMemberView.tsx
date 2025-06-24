import CustomNavBar from "../../../components/CustomNavbar"
import { useAuth } from "../../../hooks/useAuth";


const TeamMemberView = () => {

    const { getToken } = useAuth();
    
    
    return (
        <>
            <CustomNavBar />
            <main className="container"> 
                <h1>Team Member Details</h1>
            </main>
        </>
    )
}

export default TeamMemberView;