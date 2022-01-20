import moment from "moment";
import { SingleTransaction } from "../interfaces/clients.services";
import ClientsService from "./clients"

interface TrxSortedByDateEle {
    name: string;
    trxs: number
}
export default class DataReportService {
    private clientServices = new ClientsService()
    incomeVsExpenses = (clientId: string): Promise<TrxSortedByDateEle[]> => {
        return new Promise(async (resolve, reject) => {
            // implement Expenses
            // 1- need transactions His
            try {
                const trxsHis = await this.clientServices.getTrxsHis(clientId);
                const months: TrxSortedByDateEle[] = [
                    {
                        name: "Jan",
                        trxs: 0
                    },
                    {
                        name: "Feb",
                        trxs: 0
                    },
                    {
                        name: "Mar",
                        trxs: 0
                    },
                    {
                        name: "Apr",
                        trxs: 0
                    },
                    {
                        name: "May",
                        trxs: 0
                    },
                    {
                        name: "Jun",
                        trxs: 0
                    },
                    {
                        name: "Jul",
                        trxs: 0
                    },
                    {
                        name: "Aug",
                        trxs: 0
                    },
                    {
                        name: "Sep",
                        trxs: 0
                    },
                    {
                        name: "Oct",
                        trxs: 0
                    },
                    {
                        name: "Nov",
                        trxs: 0
                    },
                    {
                        name: "Dec",
                        trxs: 0
                    },
                ]
                // console.log(trxsHis)
                const trxsDates = Array.from(new Set(trxsHis.map(trx => moment(trx.date).format("MMM"))));
                // console.log(trxsDates);
                let trxSortedByDate: TrxSortedByDateEle[] = trxsDates.map(date => ({
                    name: date,
                    trxs: trxsHis.filter(trx => {
                        const formatedTrxDate = moment(trx.date).format("MMM");
                        return formatedTrxDate === date;
                    }).map(trx => trx.amount).reduce((prevEle, curEle) => prevEle + curEle)
                }));
                // output
                const output: TrxSortedByDateEle[] = months.map(month => {
                    const datesMatched = trxSortedByDate.filter(trx => trx.name === month.name);
                    return {
                        name: month.name,
                        trxs: Boolean(datesMatched.length) ? datesMatched[0].trxs : 0
                    }
                })
                resolve(output)
                // output -> [{name: "Jan", totalTrx: 89}, {name: "Feb", totalTrx: 0}, ...]
                // output -> [{name: "Jan", totalExp: 120}, {name: "Dec", totalExp: 90}]
            } catch(err) {
                reject(err)            
            }
        })
    }
}