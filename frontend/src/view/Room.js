import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Row, Col, CardColumns, ProgressBar, Badge } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import io from "socket.io-client";
import { useSelector, useDispatch } from 'react-redux';

import { selectUserInfo } from '../model/userInfo';
import { updateRoomState, selectRoomState } from '../model/room';

import './Room.css'
import { faHourglassHalf, faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

let socket = null;
if (process.env.NODE_ENV === 'development') {
    socket = io("http://localhost:3001/");
} else {
    socket = io();
}

export const RoomUser = ({ user, state }) => {

    return (
        <Card bg="light" border="dark">
            <Card.Header>
                <Card.Title className="text-center">{user.name}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text className="text-center">
                    {state === 'default' && (<FontAwesomeIcon size="2x" icon={faUser} color="black" />)}
                    {state === 'pending' && (<FontAwesomeIcon size="2x" icon={faHourglassHalf} color="goldenrod" />)}
                    {state === 'ready' && (<FontAwesomeIcon size="2x" icon={faCheck} color="green" />)}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export const RoomUsers = () => {
    const roomState = useSelector(selectRoomState);

    const getUserState = (user) => {
        if (roomState?.voting?.state !== 'started') {
            return 'default';
        }
        console.log('VOTES', user.id, roomState.voting, roomState.voting.votes[user.id]);
        if ((roomState.voting.votes[user.id] === undefined) || (roomState.voting.votes[user.id] === null)) {
            return 'pending';
        } else {
            return 'ready';
        }
    }

    return (
        <CardColumns className="p-2 bg-secondary user-columns">
            {
                roomState && roomState.users && roomState.users.map((user) => {
                    return (<RoomUser key={'user' + user.id} user={user} state={getUserState(user)} />);
                })
            }
        </CardColumns>
    );
};

export const RoomNewVoting = () => {
    // const [storyTitle, setStoryTitle] = useState('');

    const onClick = () => {
        socket.emit('voting-start', {});
    }

    return (
        <Container className="p-2 bg-light">
            <Button onClick={onClick} variant="success">Start Voting</Button>
        </Container>
    );
}

export const RoomRunningVoting = () => {
    const votes = [
        '0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?'
    ];

    const [currentVote, setCurrentVote] = useState('');

    useEffect(() => {
        setCurrentVote('');
    }, []);

    const getButtonVariant = (vote) => {
        if (vote === currentVote) {
            return 'warning';
        } else {
            return 'info';
        }
    };

    const onClick = () => {
        socket.emit('voting-finish', {});
    };

    const onVoteClick = (vote) => {
        setCurrentVote(vote);
        socket.emit('set-vote', { 'vote': vote });
    };

    return (
        <>
            <Container className="p-2 bg-light">
                <Button onClick={onClick} variant="danger">Finish Voting</Button>
            </Container>
            <Container className="p-2 bg-dark">
                <Row>
                    {
                        votes.map((vote) => {
                            return (
                                <Col key={vote} sm={3} md={2} lg={1} >
                                    <Button className="my-1" block variant={getButtonVariant(vote)} onClick={() => onVoteClick(vote)}>{vote}</Button>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
        </>
    );
}

export const RoomVotingResultsRow = ({ result }) => {
    return (
        <Row>
            <Col xs="8" className="my-auto">
                <ProgressBar className="m-1" now={result.now} max={result.max}
                    label={result.now.toString() + ' / ' + result.total.toString()} />
            </Col>
            <Col xs="2" className="my-auto">
                <h2>{result.name}</h2>
            </Col>
            <Col xs="2" className="my-auto">
                {
                    result.users.map((user) => {
                        return (
                            <div key={user.id}>
                                <Badge variant="success">{user.name}</Badge>{' '}
                            </div>
                        )
                    })
                }
            </Col>
        </Row>
    );
};

export const RoomVotingResults = ({ sortByCount }) => {
    const roomState = useSelector(selectRoomState);

    const calculateResults = () => {
        const results = [];

        let users = roomState?.users;
        let votes = roomState?.voting?.votes;

        if (users && votes) {
            users.forEach((user) => {
                if (votes[user.id]) {
                    const value = votes[user.id];

                    let foundResult = null;
                    results.forEach((result) => {
                        if (result.id === value) {
                            foundResult = result;
                        }
                    });
                    if (!foundResult) {
                        foundResult = {
                            id: value,
                            name: value,
                            now: 0,
                            users: []
                        };
                        results.push(foundResult);
                    }

                    foundResult.users.push(user);
                    foundResult.now++;
                }
            });
        }

        if (sortByCount) {
            results.sort((a, b) => {
                let rv = b.now - a.now;
                if (rv !== 0) {
                    return rv;
                } else {
                    return a.id - b.id;
                }
            });
        } else {
            results.sort((a, b) => {
                return a.id - b.id;
            });
        }

        let totalCount = 0;
        let maxCount = 0;
        results.forEach((result) => {
            totalCount += result.now;
            if (maxCount < result.now) {
                maxCount = result.now;
            }
        });
        results.forEach((result) => {
            result.max = maxCount;
            result.total = totalCount;
        });
        return results;
    };

    return (
        <Container className="p-2 bg-dark text-light">
            {
                calculateResults().map((result) => {
                    return (
                        <RoomVotingResultsRow key={result.id} result={result} />
                    )
                })
            }
        </Container>
    );
};

export const RoomFinishedVoting = () => {
    const [sortByCount, setSortByCount] = useState(false);

    const onCloseVoting = () => {
        socket.emit('voting-reset', {});
    };

    return (
        <>
            <Container className="p-2 bg-light">
                <Button onClick={() => { setSortByCount(!sortByCount) }} variant="warning">
                    {sortByCount ? 'Sort by count' : 'Sort by value'}
                </Button>
                {' '}
                <Button onClick={onCloseVoting} variant="info">Close Voting</Button>
            </Container>
            <RoomVotingResults sortByCount={sortByCount} />
        </>
    );
}

export const RoomVoting = () => {
    // const dispatch = useDispatch();
    const roomState = useSelector(selectRoomState);

    /*
        const getTitle = (roomState) => {
            let title = roomState?.voting?.title;
            if (!title) {
                title = 'User story';
            }
            return title;
        };
    */
    const getState = (roomState) => {
        return roomState?.voting?.state;
    };

    const isStateIdle = (roomState) => {
        return getState(roomState) === 'idle';
    }

    const isStateStarted = (roomState) => {
        return getState(roomState) === 'started';
    }

    const isStateFinished = (roomState) => {
        return getState(roomState) === 'finished';
    }

    /*
        const updateTitle = (event) => {
            console.log('Event', event, event.target.value);
            dispatch(setVotingTitle(event.target.value));
        };
    */

    return (
        <>
            {isStateIdle(roomState) && <RoomNewVoting />}
            {isStateStarted(roomState) && <RoomRunningVoting />}
            {isStateFinished(roomState) && <RoomFinishedVoting />}
        </>
    );
};

export const Room = ({ match }) => {
    const dispatch = useDispatch();
    const userInfo = useSelector(selectUserInfo);

    const getRoomName = (match) => {
        return match.params.room;
    }

    useEffect(() => {
        socket.on('room-updated', (msg) => {
            const room = msg;
            dispatch(updateRoomState(room));
        });
        socket.emit('room-enter', {
            'user': userInfo.name,
            'room': getRoomName(match)
        });
        return () => {
            socket.removeListener('room-updated');
            socket.emit('room-exit');
        }
    }, [userInfo.name, match, dispatch]);

    return (
        <>
            <RoomUsers />
            <RoomVoting />
        </>
    );
};

Room.propTypes = {
    match: PropTypes.object.isRequired
};
