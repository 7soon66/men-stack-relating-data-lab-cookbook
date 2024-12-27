const dotenv = require('dotenv')
dotenv.config()
const express= require('express')
const session = require("express-session")
const passUsertoView= require("./middleware/pass-user-to-view")
const app = express ();

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')


// port config
const PORT = process.env.PORT ? process.env.PORT: 3000

// Data connection 
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {

  console.log(`connected to mongoDB database: ${mongoose.connection.name}`)
})


// Middleware 
app.use(express.urlencoded({extended: false}))
app.use(methodOverride("_method"))
app.use(morgan('dev'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false ,
  saveUninitialized:true
}))
app.use(passUsertoView);


// Require controllers 
const authCtrl = require("./controllers/auth")
const recipiesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/inegrediants.js')
const isSignedIn = require('./middleware/is-sign-in')

// use controller 
app.use("/auth", authCtrl)
app.use('/recipes', recipiesController);
app.use('/ingredients', ingredientsController);
app.use(isSignedIn);
app.use(passUsertoView);





//root route
app.get('/', async (req, res) => {
  res.render('index.ejs')
})

//Route for testing 
//VIP lounge
app.get('/vip-lounge',isSignedIn,  (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}`)
})

//Listen for HTTP requests
app.listen(PORT, () => {
  console.log(`Auth app is listening for requests on port ${PORT}`)
})






