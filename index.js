const express = require('express');
const nodemailer = require("nodemailer");
const app = express()
const fs = require("fs");
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const handlebars = require("handlebars");
const bodyParser = require('body-parser');

const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const properties={
    server: "smtpout.secureserver.net",
    port: 465,
    username: "addmin@montu.shop",
    password: "Welcome123$"
}


const  transport =  {
    host: properties.server,
    port: properties.port,
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    requireTLS:true,
    debug: true,
    auth: {
      user: properties.username, // your Mailtrap username
      pass: properties.password //your Mailtrap password
    }
  }


app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`)
  
});

app.post("/query",(req,res)=>{
    sendMail(req.body);
    res.status(200);
});

app.get("/test",(req,res)=>{
    res.sendStatus(200);
    res.send("Test Success");
});


async function sendMail(request){
    console.log("Received = "+request);
    let transporter = nodemailer.createTransport(transport) ;
    let messageHtml = await readFile('./new-email.html', 'utf8');

    let template = handlebars.compile(messageHtml);
    let messageHtmlToSend = template(request);

    let message = {
    from: '"Montu Sharma" <addmin@montu.shop>', // sender address
    to: request.username + " <"+ request.email+">", // list of receivers
    subject: "Query Submitted", // Subject line
    html: messageHtmlToSend, // html body
    }

    console.log(message.to);
      
    let mail = await transporter.sendMail(message);
    
    console.log(mail.response);
      
}