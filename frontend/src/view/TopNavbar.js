import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserSlash, faHandPointUp, faHouseUser } from '@fortawesome/free-solid-svg-icons'
import { selectUserInfo, logoutUser } from '../model/userInfo';
import { Link, Switch, Route } from 'react-router-dom';

const TopNavbarUserName = () => {
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

const TopNavbarUserLogout = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector(selectUserInfo);

    const onLogout = () => {
        dispatch(logoutUser(null))
    };

    if (userInfo.isLogged) {
        return (
            <div>
                <Button onClick={onLogout} className="ml-1" size="sm" variant="danger">Logout</Button>
            </div>
        );
    } else {
        return <></>
    }
}

export const TopNavbarRoomName = ({ match }) => {
    const getRoomName = (match) => {
        return match.params.room;
    }

    return (
        <Nav.Item>
            <FontAwesomeIcon icon={faHouseUser} className="mx-2" />
            {getRoomName(match)}
        </Nav.Item>
    );
};

export const TopNavbarRoomExit = () => {
    return (
        <Link to="/">
            <Button className="ml-1" size="sm">Exit Room</Button>
        </Link>
    );
};

export const TopNavbar = () => {
    return (
        <Navbar bg="light" expand="lg" sticky="top">
            <Navbar.Brand className="mr-auto pr-3" /*as={Link} to="/"*/>
                <FontAwesomeIcon icon={faHandPointUp} size="2x" className="mx-2" />
                ScrumRoom
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Switch>
                        <Route path="/rooms/:room" component={TopNavbarRoomName} />
                    </Switch>
                    <TopNavbarUserName />
                </Nav>
                <Nav className="ml-auto">
                    <Switch>
                        <Route path="/rooms/:room" component={TopNavbarRoomExit} />
                    </Switch>
                    <TopNavbarUserLogout />
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    );
};

