import CustomNavBar from "../../../components/CustomNavbar";



const TeamDetailsView = () => {
    return (
        <>
            <CustomNavBar />
            <main className="container">
                <h1 className="my-4 text-center">Team Details</h1>
                <div className="text-center">
                    <p className="text-muted">This is a placeholder for team details.</p>
                    <p className="text-muted">You can add team members, view tasks, and manage settings here.</p>
                </div>
            </main>
        </>
    );
}