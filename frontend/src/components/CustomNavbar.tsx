import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const CustomNavBar = () => {

    const context = useContext(AppContext);
    const { logout, isCurrentUserAdmin } = useAuth();

    useEffect(() => {
    }, [])

    if (!context) {
        console.error("CustomNavBar must be used within an AppProvider");
        return null;
    }

    const { user } = context;

    return (
       <>
            <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mb-3">
                <Container>
                    <Navbar.Brand>Nurmon Team</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link className="nav-link" to="/">Nurmon Teams</Link>
                            <NavDropdown title="Options">
                                { isCurrentUserAdmin() && user && (
                                    <Link className="dropdown-item" to="/admin">Admin Mode - {user.username} </Link>
                                )}
                                <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default CustomNavBar;