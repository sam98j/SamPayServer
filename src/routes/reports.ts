import express from 'express';
import DataReports from '../controllers/reports';
import { validateClientMiddleware } from '../utils/auth';
const DataReportsHandlers = new DataReports();
const Router = express.Router();

// get the client that want to send money to him
Router.get('/income_and_expenses', validateClientMiddleware, DataReportsHandlers.getIncomeAndExpHandler);

export default Router;
