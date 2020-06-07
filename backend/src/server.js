const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http');
const io = require('socket.io');

const { createModel } = require('./model');
const { setupApi } = require('./api');

app.use(cors())

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const model = createModel();

setupApi(app, model, '/api');

const sendResponse = (res, result) => {
    console.log('SENDRESPONSE', result);
    if (result.code) {
        res.status(result.code);
    }
    if (result.response) {
        res.json(result.response);
    }
};

app.get('/', function (req, res, next) {
    res.send('Hello World!')
})

app.get("/api/topics", (req, res, next) => {
    //    getTopics((response) => sendResponse(res, response));
});
app.post("/api/topics", (req, res, next) => {
    //    addTopic(req.body, (response) => sendResponse(res, response));
});
app.delete("/api/topics/:id", (req, res, next) => {
    //    removeTopic(req.params.id, (response) => sendResponse(res, response));
});

const server = http.createServer(app);

const sockio = io(server);

sockio.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('room-enter', (msg) => {
        console.log('message: ', msg);
    });
});

const port = process.env.PORT || 3001;

server.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port.toString())
})
