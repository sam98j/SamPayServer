import Server from "./server";
// instance form server class
const MainServer = new Server(2000);
// run the server
MainServer.run()

export const SocketIoInstance = MainServer.io