const express = require("express");
const app = express();
app.use(express.static('css files'));
const ejs = require("ejs")
app.set("view engine", "ejs")
let info = [];
let id = "";

//importing mongoose
const mongoose = require("mongoose")
const URI = "mongodb+srv://toyyib:toyyib10@cluster0.c6xilee.mongodb.net/firstDatabase?retryWrites=true&w=majority"

mongoose.connect(URI, (err) => {
  if (err) {
    console.log("mongoose never start")
  } else {
    console.log("mongoose has started")
  }
})

const userSchema = mongoose.Schema({
  firstName : String,
  lastName : String,
  email : String,
  password : String
})

let userModel = mongoose.model("user_tb", userSchema)

app.use(express.urlencoded({extended:true}));

app.get("/", (req ,res) => {
  console.log("workinghhhhh")
  res.render("signUp",{message:""})
})
app.post("/signUp", (req, res) => {
  const userDetails = req.body;
  let userEmail = req.body.email;
  let {firstName ,lastName ,eMail ,password} = req.body;
  let form = new userModel(userDetails)
  if (firstName == "" || lastName == "" || eMail == "" || password == "") {
    res.render("signUp",{message:"Kindly fill all details"})
  }
  else{
    userModel.find({email:userEmail}, (err,result) => {
      if(err){
        console.log("data coulb not be found")
      }
      else{
        if(result.length > 0){
          res.render("signUp",{message:"Email already exists"})
        }
        else{
          form.save((err) => {
            if (err) {
              console.log('data could not be saved')
              res.render("signUp",{message:"signup not successful"})
            } else {
              res.redirect("signIn")
            }
          })
        }
      }
    })
  }
  
})

app.get("/signIn", (req,res) => {
  console.log("work")
  res.render("index",{message:""});
})
app.post("/signIn" ,(req, res) => {
  userModel.findOne({email:req.body.email , password:req.body.password}, (err,result) => {
    if (err) {
      res.render("index",{message:"Connect to the internet"})
    } else {
      if(result){
        res.redirect("dashboard");
      } else {
        res.render("index",{message:"Invalid email or password"})
      }
    }
  })
});
app.get("/dashboard", (req,res) => { 
  userModel.find((err, result) => {
    if (err) {
      res.render("dashboard",{mes:"could not fetch data"})
    } else {
      res.render("dashboard",{info : result,mes:""})
    }
  })
})
app.post("/edit", (req,res)=> {
  console.log(id)
  id = req.body.id
  res.redirect("/edit")
})
app.get("/edit",(req,res) => {
  console.log(id)
  userModel.findOne({_id:id}, (err, result) => {
    if (err) {
      res.render("edit",{changeResult:"",mes:"An error occured please try again"})
    } else {
      console.log(result)
      res.render("edit",{changeResult:result ,mes:""})
    }
  })
})
app.post("/delete", (req,res)=> {
  let id = req.body.id;
  userModel.deleteOne({_id:id}, (err ,result)=> {
    if (err) {
      console.log("wasn't able to delete")
    } else {
      console.log("deleted successfully")
      res.redirect("dashboard")
    }
  }) 
})
app.post("/savechanges", (req, res) => {
  let {firstName, lastName, email, password} = req.body;
  userModel.findOneAndUpdate({_id:id},{firstName, lastName, email, password}, (err, result) => {
    if (err) {
      res.render("edit",{mes:"An error occured please try again"})
    } else {
      console.log(result)
      res.redirect("dashboard")
    }
  })
  
})
app.listen(5000, () => {
  console.log("workinghh")
})