const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Ingredient = require('../models/inigredient.js');


// router logic will go here - will be built later on in the lab


router.get("/", async (req,res)=>{
  const ingredients = await Ingredient.find()
  res.render("ingredients/index",{ingredients})
})

router.post("/",async(req,res)=>{
  const {name} = req.body
  const ingredient = new Ingredient({name})
  await ingredient.save()
  res.redirect("/ingredients")
})
module.exports = router;