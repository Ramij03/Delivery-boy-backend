const mongoose= require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    uid:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    address:{type:Array, required:false},
    phone:{type:String, required:false},
    role:{type:String, required:true, default:"user", enum: ['admin', 'driver', 'user', 'vendor']},
    profile:{
        type:String,
        required:true,
        default:'https://i.pinimg.com/originals/81/d3/e0/81d3e0ac5c0e1a1ec63e6533b542cc50.jpg'
    }
  
}, {timestamps:true});

module.exports=mongoose.model('User',UserSchema);