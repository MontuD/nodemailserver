const express = require('express');
const nodemailer = require("nodemailer");
const app = express()
const fs = require("fs");
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const handlebars = require("handlebars");
const bodyParser = require('body-parser');
const cors = require("cors");

const port = 30080

app.use(cors({
  origin: 'https://montu.shop'
}))

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
    sendMail(req.body,'Query Submitted for : '+req.body.username,"new-mail");
    res.status(200);
});

app.post("/respond",(req,res)=>{
  sendMail(req.body,'Response From Admin',"");
  res.status(200);
});

app.get("/test",(req,res)=>{
    res.sendStatus(200);
    res.send("Test Success");
});


async function sendMail(request,subject,mailType){
    console.log("Received = "+request.email);
    let transporter = nodemailer.createTransport(transport) ;
    let mailFile = (mailType==="new-mail")?'./new-email.html':'./response-mail.html'
    let messageHtml = await readFile(mailFile, 'utf8');

    let template = handlebars.compile(messageHtml);
    let messageHtmlToSend = template(request);
    

    let message = {
    from: '"Montu Sharma" <addmin@montu.shop>', // sender address
    to: request.username + " <"+ request.email+">", // list of receivers
    subject: subject, // Subject line
    html: messageHtmlToSend, // html body
    }

    console.log(message.to);
      
    let mail = await transporter.sendMail(message);
    
    console.log(mail.response);
      
}