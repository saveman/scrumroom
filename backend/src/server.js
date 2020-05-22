var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.get('/', function (req, res, next) {
    res.send('Hello World!')
})

const port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log('CORS-enabled web server listening on port ' + port.toString())
})
