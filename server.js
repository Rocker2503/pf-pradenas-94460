import "dotenv/config"; // <--- ESTO DEBE IR PRIMERO QUE TODO
import handlebars from "express-handlebars";
import express from "express";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import http from 'http';

import { initMongo } from "./config/connection.js";

const app = express();
const PORT = 8080;

//Routers
import productsRouter  from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouterFunction from "./routes/views.router.js";

import configureRealTimeSockets from "./controllers/socket.controller.js";

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/views");

const serverHttp = http.createServer(app);
const socketServer = new Server(serverHttp);

app.use('/api/products', productsRouter); 
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouterFunction(socketServer));


const realTimeHandler = configureRealTimeSockets(socketServer); 
socketServer.on('connection', realTimeHandler);

initMongo()
    .then(() => {
        // Solo cuando la DB está lista, encendemos el servidor
        serverHttp.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("No se pudo iniciar el servidor debido a un fallo en la base de datos:", error);
        process.exit(1);
    });



