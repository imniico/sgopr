//LADO SERVIDOR

import express from 'express';
import __dirname from './utils.js';
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";

const app = express();
const usernames = [];

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + '/../public'));

app.use("/", viewsRouter);

const httpServer = app.listen(8080, () => {
    console.log('Server escuchando en 8080');
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {

    console.log("Nuevo cliente conectado!");

    socket.on("new-user", (username) => {
        usernames.push({ socketId: socket.id, user: username, puntaje: 0 })
        
        socketServer.emit("participantes", usernames);

        console.log("Cantidad de usuarios:", usernames.length);
        console.log("Usuarios:", usernames);
    });

    socket.on("finalizar", (data) => { 
        const userToUpdate = usernames.find(user => user.user === data.username);
        userToUpdate.puntaje = data.puntaje;

        console.log("Finalizado:", userToUpdate);
        
        socket.emit("puntaje-final", userToUpdate.puntaje)
    })

    socket.on("finalizar-todos", (data) => {
        function compararPorPuntaje(a, b) { return b.puntaje - a.puntaje; }

        usernames.sort(compararPorPuntaje);
        
        console.log("Resultados finales:", usernames);

        const resultados = usernames.filter(item => item.user !== "NicoM99");
        socket.broadcast.emit("puntuaciones", resultados);
    })

});