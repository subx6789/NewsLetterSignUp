//jshint esversion:6
require('dotenv').config();
const express=require('express');
const bodyParser = require('body-parser');
const request=require('request');
const https= require('https');
const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
});
app.post("/",(req,res)=>{
    let firstName=req.body.fName;
    let lastName=req.body.lName;
    let email=req.body.email;
    let password=req.body.password;
    let data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    let jsonData=JSON.stringify(data);
    let url=`https://us21.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;
    let options={
        method:"post",
        auth:process.env.API_KEY
    };
    const request=https.request(url,options,(response)=>{
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});
app.post("/failure",(req,res)=>{
    res.redirect("/");
});
app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port 3000");
});