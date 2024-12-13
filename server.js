const dotenv=require("dotenv")
dotenv.config()
const express=require("express")
const session=require("express-session")
const app=express()
const mongoose=require("mongoose")
const passUserToView = require("./middleware/pass-user-to-view.js");
const isSignedIn=require("./middleware/is-sign-in.js")
const methodOverride=require("method-override")
const morgan=require("morgan")
const recipesController = require('./controllers/recipies.js');
const ingredientsController = require('./controllers/inegrediants.js');
//port configuration

const PORT=process.env.PORT ? process.env.PORT:3000

//data connection

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected",()=>{

  console.log(`Connected to MongoDB Database:${mongoose.connection.name}.`)
})

//Middlewares

app.use(express.urlencoded({extended:false}))
app.use(methodOverride("_method"))
app.use(morgan("dev"))
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true
}))

app.use(passUserToView)

//Require Controller

const authCtrl=require("./controllers/auth")

//use Controller
app.use("/auth" , authCtrl)
app.use('/recipies', recipesController);
app.use('/inegrediants', ingredientsController);

//route route

app.get("/",async (req,res)=>{
  res.render("index.ejs")
})


// Rote for testing
//vip-lounge

// app.get("/vip-lounge",isSignedIn,(req,res)=>{
//   res.send(`Welcome to our party ${req.session.user.username}`)
// })

app.listen(PORT,()=>{
  console.log(`i'am on route ${PORT}`)
})