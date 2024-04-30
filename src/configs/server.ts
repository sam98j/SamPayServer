import Express, { Application, Request, Response } from 'express';
import AuthRoutes from '../routes/auth';
import MainRoutes from '../routes/transactions';
import FilesUploadRoutes from '../routes/uploading';
import DataReportsRoutes from '../routes/reports';
import cors from 'cors';
import { Configs } from '../interfaces/server.config';
import swaggerUi from 'swagger-ui-express';
import ConfigDB from './database';
import { join } from 'path';
// config server routes
export class ServerConfigs implements Configs {
  // express app object
  private app: Application;
  // constructor function
  constructor(app: Application) {
    // set the app property
    this.app = app;
  }
  // config database
  private configDatabase() {
    // remote database
    const uri = process.env.MONGODB_URI as string;
    // create connection
    const db = new ConfigDB(uri);
    // run the database
    db.run();
  }
  // config the routes
  private configRoutes() {
    // auth routes
    this.app.use('/auth', AuthRoutes);
    // main routes
    this.app.use('/', MainRoutes);
    // DataReports Routes
    this.app.use('/reports', DataReportsRoutes);
    // file uploading routes
    this.app.use('/files', FilesUploadRoutes);
    //
    this.app.get('*', (req: Request, res: Response) => {
      res.sendFile(join(__dirname, '../../public/index.html'));
    });
  }
  // config middleware
  private configMiddleWare() {
    // server response to the other servers
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST'],
      })
    );
    // response json data
    this.app.use(Express.json());
    this.app.use(Express.static(join(__dirname, '../../public')));
  }
  // config swagger
  private configSwagger() {
    this.app.use(Express.static('public'));
    this.app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(undefined, {
        swaggerOptions: {
          url: '/swagger.json',
        },
      })
    );
  }
  // run all the configs
  configure() {
    // middleware config
    this.configMiddleWare();
    // database config
    this.configDatabase();
    // config swagger
    this.configSwagger();
    // routes config
    this.configRoutes();
  }
}
