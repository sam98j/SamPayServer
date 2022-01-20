import http from 'http';
import {Server} from 'socket.io';
import ClientsService from '../services/clients';

export function runSocket(server: http.Server){
    const clientService = new ClientsService();
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:4000"],
            methods: ["GET", "POST"]
        }
    });
    io.on("connection", async (clientScoket) => {
        const _id = clientScoket.handshake.query.client_id as string;
        const socket_id = clientScoket.id;
        try {
            await clientService.setSocketId({_id, socket_id})
            console.log("secoket id seting successful")
        }catch (err) {
            throw new Error(err as string)
        }
        console.log("client connected", clientScoket.id)
    });
    return io
}