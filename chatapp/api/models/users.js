const mongoose= require("mongoose");
const schema=new mongoose.Schema({
    username: {type: String , unique: true},
    password: String 
},{timestamps: true})  
const userModel = mongoose.model('user', schema);

module.exports = userModel; // Use CommonJS export 