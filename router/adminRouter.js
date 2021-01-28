let mongoose = require('mongoose');
let express = require('express');
const multer = require('multer');
let router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
let adminSchema = require('../model/admin');
const fs = require("fs");
const path = require("path");

router.post('/adminsetting',multer({ dest: 'uploads' }).any(), async (req,res) => {
    if(req.files)
    {
        console.log(req.files);
        var filename = "avatar";
        var originalname = req.files[0].originalname;
        var originalname = originalname.split('.');
        var new_path = 'uploads/' + filename + '.' + originalname[originalname.length-1];
        var old_path = req.files[0].path;
        var save_path =  filename + '.' + originalname[originalname.length-1];
        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink('uploads/' + req.files[0].filename, async err => {
                    if(!err){
                        const { firstname, lastname, email, password, role } = req.body;
                        const admininfo = new adminSchema({
                            firstname,
                            lastname,
                            email,
                            password,
                            file_path: save_path,
                            role
                        });
                        adminSchema.findOne({role:req.body.role})
                        .then(check => {
                            if(check){
                                var myquery = { role: "admin" };
                                var newvalues = { $set: { firstname: firstname, lastname: lastname, email: email, password: password, file_path: save_path } };
                                adminSchema.updateOne(myquery, newvalues, function(err, res) {
                                    if (err) throw err;
                                    console.log("1 document updated");
                          
                                  });
                               }
                            
                        
                            else{
                                admininfo.save().then((rdata) => {
                                    // console.log(rdata)
                                });
                            }
                        })
                       
                       
                    }
                    else {
                        res.json({
                            status : "error"
                        })
                    }
                })
            });
        });
    }
})

router.route('/getadmin').post((req,res)=>{
   adminSchema.findOne({role:"admin"})
   .then(check =>{
       if(check){
           res.json(check);
       }
   })
})

module.exports = router;