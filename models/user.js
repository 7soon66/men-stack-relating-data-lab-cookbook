const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
  username:{
    type:String,
    require:true
  },
  password:{
type:String,
require:true
  },
  pantry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }] 
},{
  timestamps:true //createdAt and updatedAt
})


const User=mongoose.model("User",userSchema)
module.exports=User