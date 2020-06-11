const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http');
const io = require('socket.io');
const fs = require("fs");
const path = require('path');

app.use(cors())

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const staticContentPath = path.resolve(__dirname, '..', 'static')
if (fs.existsSync(staticContentPath)) {
    app.use('/', express.static(staticContentPath));
    app.use('*', function (req, res) {
        res.sendFile(path.resolve(staticContentPath, 'index.html'));
    });
} else {
    app.get('/', function (req, res, next) {
        res.send('Hello World!')
    })
}

const server = http.createServer(app);
const sockio = io(server);

class SocketContext {
    constructor(socket) {
        this.socket = socket;
        this.roomName = null;
        this.userName = null;
    }

    get id() {
        return this.socket.id;
    }
};

class Room {
    constructor(name) {
        this.name = name;
        this.contexts = new Map();
        this.votingState = 'idle';
        this.votes = new Map();
    }

    addContext(context) {
        this.contexts.set(context.id, context);
        this._broadcastUpdate();
    }

    removeContext(context) {
        this.contexts.delete(context.id);
        this.votes.delete(context.id);

        this._broadcastUpdate();
    }

    isEmpty() {
        return this.contexts.size == 0;
    }

    startVoting() {
        if (this.votingState != 'idle') {
            return;
        }

        this.votingState = 'started';
        this._broadcastUpdate();
    }

    finishVoting() {
        if (this.votingState != 'started') {
            return;
        }

        this.votingState = 'finished';
        this._broadcastUpdate();
    }

    resetVoting() {
        if (this.votingState != 'finished') {
            return;
        }

        this.votingState = 'idle';
        this.votes.clear();
        this._broadcastUpdate();
    }

    setVote(context, vote) {
        if (this.votingState != 'started') {
            return;
        }

        this.votes.set(context.id, vote);
        this._broadcastUpdate();
    }

    _createUsersArray() {
        const users = [];

        this.contexts.forEach((value) => {
            users.push({ 'id': value.id, 'name': value.userName });
        });

        return users;
    }

    _createVoting() {
        const voting = {};

        voting.state = this.votingState;
        voting.title = 'some title';
        voting.votes = {};
        this.votes.forEach((value, key) => {
            voting.votes[key] = value;
        });

        return voting;
    }

    _createStatusObject() {
        const status = {}

        status.name = this.name;
        status.users = this._createUsersArray();
        status.voting = this._createVoting();

        return status;
    }

    _broadcastUpdate() {
        const statusObject = this._createStatusObject();

        console.log('broadcasting', statusObject);

        this.contexts.forEach((value) => {
            value.socket.emit('room-updated', statusObject);
        });
    }
};

class ScrumRoomApp {
    constructor() {
        this.contexts = new Map();
        this.rooms = new Map();
    }

    onSocketConnected(socket) {
        console.log('a user connected', socket.id);

        const context = new SocketContext(socket);

        this.contexts.set(socket.id, context);
        console.log("Contexts", this.contexts);
    }

    onSocketDisconnected(socket) {
        console.log('user disconnected', socket.id);

        const context = this.contexts.get(socket.id);

        if (context.roomName) {
            this.onSocketRoomExited(socket, null);
        }

        this.contexts.delete(socket.id);
        console.log("Contexts", this.contexts);
    }

    onSocketRoomEntered(socket, msg) {
        console.log('room entered: ', socket.id, msg);

        const context = this.contexts.get(socket.id);

        if (context.roomName) {
            this.onSocketRoomExited(socket, null);
        }

        if (!msg.user || !msg.room) {
            console.log('user or room missing:', msg);
            return;
        }

        context.userName = msg.user;
        context.roomName = msg.room;

        let room = this.rooms.get(context.roomName);
        if (!room) {
            room = new Room(context.roomName);
            this.rooms.set(context.roomName, room);
        }
        room.addContext(context);
        console.log('Rooms', this.rooms);

        console.log("Contexts", this.contexts);
    }

    onSocketRoomExited(socket, msg) {
        console.log('room exited: ', socket.id, msg);

        const context = this.contexts.get(socket.id);

        if (context.roomName) {
            const room = this.rooms.get(context.roomName);
            room.removeContext(context);
            if (room.isEmpty()) {
                this.rooms.delete(context.roomName);
            }
            console.log('Rooms', this.rooms);
        }

        context.userName = null;
        context.roomName = null;

        console.log("Contexts", this.contexts);
    }

    onVotingStart(socket, msg) {
        console.log('voting start: ', socket.id, msg);

        const context = this.contexts.get(socket.id);

        if (!context.roomName) {
            return;
        }

        const room = this.rooms.get(context.roomName);
        if (!room) {
            return;
        }

        room.startVoting();
    }

    onVotingFinish(socket, msg) {
        console.log('voting finish: ', socket.id, msg);

        const context = this.contexts.get(socket.id);

        if (!context.roomName) {
            return;
        }

        const room = this.rooms.get(context.roomName);
        if (!room) {
            return;
        }

        room.finishVoting();
    }

    onVotingReset(socket, msg) {
        console.log('voting reset: ', socket.id, msg);

        const context = this.contexts.get(socket.id);

        if (!context.roomName) {
            return;
        }

        const room = this.rooms.get(context.roomName);
        if (!room) {
            return;
        }

        room.resetVoting();
    }

    onSetVote(socket, msg) {
        console.log('set vote: ', socket.id, msg);

        const context = this.contexts.get(socket.id);

        if (!context.roomName) {
            return;
        }

        const room = this.rooms.get(context.roomName);
        if (!room) {
            return;
        }

        room.setVote(context, msg.vote);
    }

};

const scrumRoomApp = new ScrumRoomApp();

sockio.on('connection', (socket) => {
    scrumRoomApp.onSocketConnected(socket);

    socket.on('disconnect', () => {
        scrumRoomApp.onSocketDisconnected(socket);
    });

    socket.on('room-enter', (msg) => {
        scrumRoomApp.onSocketRoomEntered(socket, msg);
    });

    socket.on('room-exit', (msg) => {
        scrumRoomApp.onSocketRoomExited(socket, msg);
    });

    socket.on('voting-start', (msg) => {
        scrumRoomApp.onVotingStart(socket, msg);
    });

    socket.on('voting-finish', (msg) => {
        scrumRoomApp.onVotingFinish(socket, msg);
    });

    socket.on('voting-reset', (msg) => {
        scrumRoomApp.onVotingReset(socket, msg);
    });

    socket.on('set-vote', (msg) => {
        scrumRoomApp.onSetVote(socket, msg);
    });
});

const port = process.env.PORT || 3001;

server.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port.toString())
})
