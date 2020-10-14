const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const sequelize = require('./databaseConnection');
const templates = require('./models/templates');
const templateRouter = require('./routes/template-routes');
const user = require('./models/user');
const authRouter = require('./routes/auth-routes');
const testRouter = require('./routes/test-routes');


const path = require('path');
const fs = require('fs');

const normalizePort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    //debug("Listening on " + bind);
    console.log("Listenning on " + bind);

};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
app.use(cors());

app.use('/template', templateRouter);
app.use('/auth', authRouter);
app.use('/test', testRouter);


sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        sequelize.sync();

    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);