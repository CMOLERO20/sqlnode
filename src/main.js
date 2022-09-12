import express from 'express'

import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'

import ContenedorSQL from './contenedores/ContenedorSQL.js'

import config from './config.js'

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorSQL(config.mariaDb, 'productos')
const mensajesApi = new ContenedorSQL(config.sqlite3, 'mensajes')

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('conectado')
    socket.emit('productos', await productosApi.listarAll())

    socket.on('update', async (producto) => { 
    console.log(producto);
        productosApi.guardar(producto);
        const productos =  await productosApi.listarAll()
        io.sockets.emit('productos', productos );
    });

    socket.emit('mensajes', await mensajesApi.listarAll());

    socket.on('nuevoMensaje', async (data) => {
        mensajesApi.guardar(data)
        console.log(await mensajesApi.listarAll())
        io.sockets.emit('mensajes', await mensajesApi.listarAll());
    });

    //Implementación
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
