const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
    }
});

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyParser());

app.use('/', (req, res) => {
    res.status(200).json({ msg: 'API IS ALIVE!' });
})

let chat = [{}]

io.on('connection', (socket) => {
    socket.on('send-message', (data) => {
        chat.push({
            name: data.nick,
            message: data.message,
        });
        io.emit('message-from-server', chat);
    },
        socket.emit('message-from-server', chat),
    )
});

async function connection () {
    const port = process.env.PORT;
    try {
        console.log('Connected to database');
        server.listen(port, () => {
            console.log(`Listening on port ${port}`)
        });
    } catch (err) {
        console.log(err);
    }
}

connection();

module.exports = app;