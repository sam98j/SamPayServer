import Server from "./server";
import { sendMail } from "./services/mail";
// instance form server class
export const MainServer = new Server(2000);
// run the server
MainServer.run()
export const SocketIoInstance = MainServer.io