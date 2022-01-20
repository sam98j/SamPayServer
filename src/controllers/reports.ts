import { Request, Response } from "express";
import DataReportServices from "../services/dataReports";

export default class DataReports {
    // controller services
    private dataReportServices = new DataReportServices();
    // method to get compared data between income and expenses
    getIncomeAndExpHandler = async (req: Request, res: Response) => {
        // current authentic user id
        const currentClientId = req.currentClient!
        try {
            // call the corsponding service to get income and expenses data
            const getIncomeAndExpData = await this.dataReportServices.incomeVsExpenses(currentClientId);
            res.send(getIncomeAndExpData)
        } catch(err) {
            res.status(500).send(err)
        }
    }
}