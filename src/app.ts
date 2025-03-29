import express from "express";
import { createServer } from "http";
import moment from "moment";

const start = () => {
    const app = express()
    const server = createServer(app)
    server.listen(3005, () => {
        console.log(`The time is ${moment.now()}`);
    })
}

start()