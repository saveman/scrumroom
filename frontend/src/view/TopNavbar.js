import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserSlash, faHandPointUp } from '@fortawesome/free-solid-svg-icons'
import { selectUserInfo, logoutUser } from '../model/userInfo';
import { Link } from 'react-router-dom';

const TopNavbarUserInfo = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector(selectUserInfo);

    const onLogout = () => {
        dispatch(logoutUser(null))
    };

    if (userInfo.isLogged) {
        return (
            <div>
                <FontAwesomeIcon icon={faUser} className="mx-2" />
                {userInfo.name}
                <Button onClick={onLogout} className="ml-1" size="sm">Logout</Button>
            </div>
        );
    } else {
        return (
            <div>
                <FontAwesomeIcon icon={faUserSlash} className="mx-2" />
                {"Not logged"}
            </div>
        );
    }
}

export const TopNavbar = () => {
    return (
        <Navbar bg="light" expand="lg" sticky="top">
            <Navbar.Brand className="mr-auto" as={Link} to="/">
                <FontAwesomeIcon icon={faHandPointUp} className="mx-2" />
                ScrumRoom
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                </Nav>
                <Nav className="ml-auto">
                    <TopNavbarUserInfo />
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    );
};

