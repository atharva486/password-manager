const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('./models/userModel');
const cookieParser = require('cookie-parser');
const passwordModel = require('./models/passwordModel');
const cors = require('cors');

app.use(cors({origin:'http://localhost:5173',credentials:true}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.post('/api/login', async (req,res)=>{
    //cookie and bcrypt here and jwt token also here heck how to give secret key
    let {email,password}=req.body;
    let user = await userModel.findOne({email:email});
    if(!user){
        return res.json({success:false});
    }
    else{
        let token = jwt.sign({email:email,password:password},"secret");
            res.cookie("token",token);
        return res.json({success:true,id:user._id});
    }
})

app.post('/api/register',(req,res)=>{
    let {name,email,password}=req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt , async (err,hash)=>{
            let user = await userModel.create({
                name,
                email,
                password:hash,
            })
            let token = jwt.sign({email:email,password:password},"secret");
            res.cookie("token",token);
            res.json({success:true});

        })
    })

})

app.get('/api/getid',async (req,res)=>{

    const decoded = jwt.verify(req.cookies.token,"secret");
    let user = await userModel.findOne({email : decoded.email});
    res.json({id:user._id,success:true});
})

app.get('/api/logout',(req,res)=>{
    res.cookie('token',"");
  res.json({ success: true });  
})
app.post('/api/create/:id',async (req,res)=>{
    let {sitename,password}=req.body;
    let user = await userModel.findOne({_id:req.params.id}); 
    let pass = await passwordModel.create({
        sitename,
        password,
        userid:user._id,        
    });
    user.passid.push(pass._id);
    user.save();
    res.json({success:true});
})
app.post('/api/del/:id', async (req,res)=>{
    let user = await userModel.findOne({_id:req.params.id});
    let idx = req.body;
    let id  = user.passid[idx.delindex];
    user.passid.splice(idx.delindex,1);
    user.save();
    let password = await passwordModel.findByIdAndDelete(id);
    if(password!= null)
        res.json({success:true})
    else
        res.json({success:false});
});
app.get('/api/edit/:id/:idx', async (req,res)=>{
    let user = await userModel.findOne({_id : req.params.id});
    let passwordId = user.passid[req.params.idx];
    let content = await passwordModel.findOne({_id:passwordId});
    res.json({sitename:content.sitename,password:content.password,success:true});
});
app.post('/api/edit/:id/:idx', async (req,res)=>{
    let user = await userModel.findOne({_id : req.params.id});
    let passwordId = user.passid[req.params.idx];
    let content = await passwordModel.findOne({_id:passwordId});
    content.sitename = req.body.sitename;
    content.password = req.body.password;
    await content.save();
    res.json({success:true});
})
app.get('/api/show/:id',async (req,res)=>{
    let pass = await userModel.findOne({_id:req.params.id}).populate('passid');
    res.json({passwords:pass.passid,success:true,name:pass.name});
})

app.listen(3000);