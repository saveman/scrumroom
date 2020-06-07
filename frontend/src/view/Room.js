import React, { useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import io from "socket.io-client";
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../model/userInfo';

const ENDPOINT = "http://localhost:3001/";

export const Room = ({ match }) => {
    const userInfo = useSelector(selectUserInfo);

    const getRoomName = () => {
        return match.params.room;
    }

    useEffect(() => {
        const socket = io(ENDPOINT);
        socket.on("FromAPI", data => {
            console.log(data);
        });
        // TODO: this probably should be done only on enter etc.
        socket.emit('room-enter', {
            'user': userInfo.name,
            'room': getRoomName()
        });
    }, []);

    // const dispatch = useDispatch();
    // const userInfo = useSelector(selectUserInfo);

    // let userId = this.props.match.params.userId;

    return (
        <Button>{getRoomName()}</Button>
    );
};

Room.propTypes = {
    match: PropTypes.object.isRequired
};
