let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    const passport = require("passport");
    var nodemailer = require("nodemailer");
    var path    = require("path");
    var rootDir = path.dirname(require.main.filename);

    let reqStore;
    

    //user model
let userSchema = require('../model/user');

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "webexpert0524@gmail.com",
        pass: "Mysister200165!"
    }
});
var rand,mailOptions,mailOptions1,host,link;

//Create user
router.route('/create-user').post((req, res, next) => {
    userSchema.findOne({email:req.body.email})
    .then(check =>{
        if(check){
            console.log("email already exist")
            return res.status(400).json({email:"Email already exists"});
            
        }
        else{
            userSchema.findOne({subdomain:req.body.subdomain})
            .then(check =>{
                if(check){
                    console.log("subdomain already exist")
                    return res.status(300).json({subdomain: "sunbdomain already exist"});

                }
                else{
                    userSchema.create(req.body, (error, data) => {
                        if (error) {
                            return next(error)
                        }
                        else{
                            console.log(data)
                            res.json(data)
                        }
                })
                }
            })
           
    }})
})

//Read User

router.route('/getuser').post((req, res) =>{
    userSchema.find((error, data) => {
        if (error) {
            return next(error)
        }
        else{
            res.json(data)
        }
    })
})

router.route('/activeuser/:id').post((req, res, next) =>{
    userSchema.findByIdAndUpdate(req.params.id, {$set: {permission: "active"}}, (error, data) => {
        if (error) {
            return next(error)
        }
        else{
            res.json(data)
        }
    })
})

router.route('/deactiveuser/:id').post((req, res, next) =>{
    userSchema.findByIdAndUpdate(req.params.id, {$set: {permission: "deactive"}}, (err, data) => {
        if(err){
            return next(error)
        }
        else{
            res.json(data)
        }
    })
})

router.route('/deleteuser/:id').delete((req, res, next) =>{
    userSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if(error){
            return next(error);
        }
        else{
            res.status(200).json(data);
        }
    })
})

router.route('/confirm-email').post(function(req,res, next){
    reqStore = Object.assign({}, req.body);
    console.log("ok is ", reqStore)
    userSchema.findOne({email:req.body.email})
    .then(check =>{
        if(check){
            console.log("email already exist")
            return res.status(400).json({email:"Email already exists"});
            
        }
        else{
            userSchema.findOne({subdomain:req.body.subdomain})
            .then(check =>{
                if(check){
                    console.log("subdomain already exist")
                    return res.status(300).json({subdomain: "sunbdomain already exist"});

                }
                else{
                    rand=Math.floor((Math.random() * 10000000) + 54);
                    host=req.get('host');
                    link="http://3.139.50.101:3000"+"/verify?id="+rand;
                    mailOptions={
                        to : req.body.email,
                        subject : "Please confirm your Email account",
                        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"	
                    }
                    console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response){
                        if(error){
                            console.log(error);
                        return next("error");
                     }else{
                            console.log("Message sent: " + link);
                        res.json(200);
                         }
                });
                }
        })
}});
})

router.route('/verify/:id').get(function(req,res){
    // console.log(req.protocol+":/"+req.get('host'));
    // if((req.protocol+"://"+req.get('host'))==("http://"+host))
    // {
        console.log("Domain is matched. Information is from Authentic email");
        console.log(req.params.id)
        if(req.params.id==rand)
        {
            console.log(typeof reqStore)
            userSchema.create(reqStore, (error, data) => {
                if (error) {
                    return next(error)
                }
                else{
                    console.log(data)
                    mailOptions1={
                        to : "emanuel.darlea@gmail.com",
                        subject : "New user are registered",
                        html : "Hello sir,<br>"+reqStore.firstname+" "+reqStore.lastname + " need to get own intranet. <br/> His subdomain is "+ reqStore.subdomain+"<br/> Thanks"	
                    }
                    console.log(mailOptions1);
                    smtpTransport.sendMail(mailOptions1, function(error, response){
                        if(error){
                            console.log(error);
                        return next("error");
                     }else{
                            console.log("Message sent: " + link);
                            res.json(200)
                         }
                });
                }
        })

        }
        else
        {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    // }
    // else
    // {
    //     res.end("<h1>Request is from unknown source");
    // }
    });

module.exports = router;