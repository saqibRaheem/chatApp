// import express from "express";
// import morgan from "morgan";
// import  Mongoose  from "mongoose";
// import cors from "cors";
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const Mongoose = require('mongoose');
const bcrtpt = require('bcrypt-inzi');
const jwt = require('jsonwebtoken');
const req = require("express/lib/request");
// const bodyparsa = require('body-parser');
const path = require("path")
const cookiParser = require("cookie-parser");
const bodyParser = require("body-parser");


const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors('short'));
app.use(bodyParser.json())
app.use(cookiParser())
app.use('/', express.static(path.resolve(path.join())));


var SERVER_SECRET = process.env.SECRET || "3456";
const dburi = "mongodb+srv://saqib:saqib@cluster0.wdqfa.mongodb.net/chatApp?retryWrites=true&w=majority"
const port = process.env.PORT || 3000;

Mongoose.connect(dburi)
Mongoose.connection.on('connected', () => {
    console.log('mongoose is connected');
});
Mongoose.connection.on('disconnected', () => {
    console.log('mongoose is disconnected');
    process.exit(1);
});
Mongoose.connection.on('error', (error) => {
    console.log('mongoose connection is an error', error);
});
Mongoose.connection.on('SignIN', () => {
    console.log('mongoosse is turningOff');
    Mongoose.connection.close('disconnect', () => {
        console.log('mongoose is disconnected');
    });
});

////// MongoDB Working //////
//// Create schema /////
var loginSchema = new Mongoose.Schema({
    firstName: String,
    lastName: String,
    contact: Number,
    email: String,
    password: String,

    createdOn: { type: Date, 'default': Date.now }
});

var loginModel = Mongoose.model('users', loginSchema);
app.use((req, res, next) => {
    console.log('starting server', req.body);
    next();

});

///  post request ///
/// create Account ////
app.post('/user', (req, res, next) => {
    if (!req.body.firstName
        || !req.body.lastName
        || !req.body.contact
        || !req.body.email
        || !req.body.password) {
        res.status(404).send('invalid data')
        // console.log(res);
        return;
    }
    loginModel.findOne({ email: req.body.email }, (error, data) => {
        if (error) {
            console.log(error, "line number 65");
            res.status(505).send({
                message: 'error'
            })
        }
        else if (!data) {
            bcrtpt.stringToHash(req.body.password).then(hashPassword =>{
                console.log(hashPassword);
            var newRequest = new loginModel({
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "contact": req.body.contact,
                "email": req.body.email,
                "password": hashPassword
            })
            console.log(newRequest, "ye data h");
       
            newRequest.save((err, data) => {
                if (!err) {

                    console.log("create account", data);
                    res.status(202).send({
                        message: "created Account"
                    })
                } else {

                    console.log("create account error", err);
                    res.status(403).send({
                        message: "try Again"
                    })

                }
            })
        }) 
        }
        else {
            console.log(data)
            res.status(401).send({
                message: "alrady exist"
            })
        }
    })
});
//// login Account //////
app.post('/login',(req,res)=>{
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;
    
    if(!loginEmail||!loginPassword){
        res.status(400).send({
            message:"create Account"
        })
    }else{
          loginModel.findOne({email:loginEmail},(err,data)=>{
            if(err){
                res.status(500).send({
                    message:"InCorrect Email"
                })
            }
            else if(data){
                bcrtpt.varifyHash(loginPassword,data.password).then(match=>{
                    if(match){
                        var webtoken = jwt.sign({
                            email:data.email,
                            password:data.password,
                            ip:req.connection.remoteAddress
                        },SERVER_SECRET);
                        // res.cookie('jToken', webtoken, {
                        //     maxAge: 86_400_000,
                        //     httpOnly: true
                            // });
                        res.status(201).send({
                            message:"login SuccessFully"
                        });

                    }else{
                        res.status(403).send({
                            message:"incorrect Password"
                        });
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            }else{
                res.status(403).send({
                    message:"incorrect Email"
                })
            }
        })
    }
})

//// cookies ////
// app.use((req,res,next)=>{
//     console.log('cookie',req.cookies);
//     if(!req.cookies.jToken){
//         res.status(401).send("include http-only credentials with every request");
//         return;
//     }
//     jwt.verify(req.cookies.jToken,SERVER_SECRET,(error,decordedData)=>{
//         if(!err){
//             const issueDate = decordedData.iat * 1000
//             const nowDate = new Date().getTime()
//             const diff = nowDate - issueDate

//                 if(diff > 3000){
//                     res.status(401).send('Token Expired')
//                 }else{
//                     var webtoken = jwt.sign({
//                         email:decordedData.email,
//                         password:decordedData.password,
//                         // ip:req.connection.remoteAddress
//                     },SERVER_SECRET);
//                     res.cookie('jToken', webtoken, {
//                         maxAge: 86_400_000,
//                         httpOnly: true
//                         });
//                         req.body.jToken = decordedData
//                         next();
//                 }
//         }else{
//             res.status(401).send('invalid Token')
//         }
//     })
// })
//// message....//////
var messageSchema = new Mongoose.Schema({
   message : String,
    createdOn: { type: Date, 'default': Date.now }
});
var messageModel = Mongoose.model('message', messageSchema);
app.post('/message',(req,res,next)=>{
    if(!req.body.message){
        res.status(300).send({
            message:"enter message"
        })
        next();
    }else{

        // messageModel.findOne({},(error,data)=>{
        //     if(error){
        //         console.log(error,"somthing error");
                
        //     }else if(!data){
              var newMessage = new messageModel({
                  "message":req.body.message
                })
              console.log(newMessage);
              newMessage.save().then(()=>{
                console.log("message send");
               res.status(202).send({
                    message: "message send"
                })
              })
                  
                // if (!err) {
                    
                //     console.log("message send", data);
                //     res.status(202).send({
                //         message: "message send"
                //     })
                // // }
                // else {
                    
                //     console.log("try again", err);
                //     res.status(403).send({
                //         message: "try Again"
                //     })

                // }
            // })
            // }
            // else{
            //     console.log("error");
            //     res.status(402).send({
            //         message:"message not send"
            //     })
            // }
        // })
    }
    })
app.get('/get',(req,res)=>{
    messageModel.find({},(err,data)=>{
        if(!err){
            res.send(data)
            console.log("ye data h " , data);
        }
        else{
            res.status(404).send("invalid data")
        }
    })
})
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port} port`)
}); 