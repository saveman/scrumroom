import React from 'react'
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';

import { selectUserInfo } from '../model/userInfo';
import { TopNavbar } from './TopNavbar';
import { LoginModal } from './LoginModal';

import './App.css';
import { Switch, Route, Redirect } from 'react-router';
import { RoomSelectModal } from './RoomSelectModal';
import { Room } from './Room';

export const App = () => {
    const userInfo = useSelector(selectUserInfo);

    return (
        <Container className="mainContainer">
            <TopNavbar />
            <LoginModal />
            {
                userInfo.isLogged &&
                (
                    <Switch>
                        <Route exact path="/" component={RoomSelectModal} />
                        <Route path="/rooms/:room" component={Room} />
                        <Redirect to="/" />
                    </Switch>
                )
            }
        </Container >
    );
}
