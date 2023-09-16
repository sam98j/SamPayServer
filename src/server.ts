import Express, {Application, Request, Response} from "express"
import { Configs } from "./interfaces/server.config";
import { ServerConfigs } from "./configs/server";
import http from 'http'
import dotenv from 'dotenv';
import { runSocket } from "./utils/socket";
import {Server as SocketIoServer} from 'socket.io'
import { join } from "path";
// Server class
class Server {
    // Express app object
    public app: Application = Express();
    // the express app port
    private port: number | string = 1000;
    // http server
    private server: http.Server;
    // socket io
    io: SocketIoServer;
    // server configurations
    private configs: Configs = new ServerConfigs(this.app);
    // constructor function
    constructor(port: number) {
        // reset the app port
        this.port =  process.env.PORT || port;
        this.server = http.createServer(this.app)
        this.io = runSocket(this.server);
        this.app.use(Express.static(join(__dirname, '/public'))); 
    }
  
    run() {
        // run the server configruations
        dotenv.config()
        // run the socket server
        // config the server
        this.configs.configure()
        // run the server
        this.server.listen(this.port, () => console.log("server is runnin", this.port))
    }
}

export default Server