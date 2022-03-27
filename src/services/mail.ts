import sendGridMail, {MailDataRequired} from '@sendgrid/mail';

export async function sendMail(data: MailDataRequired){
    // set the api key
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY!)
    const res = await sendGridMail.send(data);
    return res[0].statusCode
}