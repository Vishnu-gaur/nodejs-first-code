//@ts-check
import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { nextTick } from "process";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


mongoose
.connect("mongodb://localhost:27017",{
  dbName: "backend",
}).then(()=>console.log("Database Connected")).catch

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
}); 
 
const user = mongoose.model("user", userSchema);

const app = express();
const users=[];

app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



app.set("view engine", "ejs");
const isAuthenticated = async(req ,res, next) =>{
  const {token}= req.cookies;
  if(token){

     const decoded = jwt.verify(token, "sdihvnnn");
       req.user = await user.findById(decoded.id);
     
     
     next();
  }
  else{
          res.render("login");
  }

};

  app.get("/", async (req, res)=>{
    const {token}= req.cookies;
    const result = await jwt.decode(token);
  
    
    if(result){
      const current_user = await user.findById(String(result._id));
      res.render("logout",{
              name:current_user.name
            });
    }
    else{
            res.render("login");
    }
    
});
          app.get("/", isAuthenticated,(req, res, next)=>{
            
           res.render("logout",{name: req.user.name});
});

app.get("/register",(req, res, next)=>{
            
  res.render("register");
});

app.post("/login",async(req, res)=>{
    const{name,email} = req.body;
    console.log({name,email})

    const logged_in_user = await user.findOne({email})
    if(!logged_in_user){

      return res.redirect("/register");

    }
 
     const new_user =  await user.create({
      name,
      email,
   });
    const token = jwt.sign({_id:logged_in_user._id},"sdihvnnn");
       console.log(token);
        res.cookie("token", token, {
         httpOnly: true, 
          expires:new Date(Date.now()+60*1000),
    
});
          res.redirect("/");
});

app.get("/logout",(req, res)=>{
         res.cookie("token","null",{
         httpOnly: true, 
        expires:new Date(Date.now()),
 
});
       res.redirect("/");
});


app.listen(5000, ()=>{
  console.log("server is working");
});


