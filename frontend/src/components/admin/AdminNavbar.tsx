import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

const AdminNavbar = () => {

    const { isCurrentUserAdmin, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Checking if current user is admin: " + isCurrentUserAdmin());
        if(!isCurrentUserAdmin()){
            navigate('/');
        }
    }, []);

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mb-3 w-100 p-3">
                <Container>
                    <Navbar.Brand>Nurmon Team</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link className="nav-link" to="/admin">Users</Link>
                            <Link className="nav-link" to="/admin/nurmons">Nurmons</Link>
                            <Link className="nav-link" to="/admin/items">Items</Link>
                            <Link className="nav-link" to="/admin/movements">Movements</Link>
                            <Link className="nav-link" to="/admin/abilities">Abilities</Link>
                            <NavDropdown title="Options">
                                <Link className="dropdown-item" to="/">User Mode</Link>
                                <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default AdminNavbar;