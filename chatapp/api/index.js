const express= require("express");
const app=express()
const dotenv=require("dotenv")
const mongoose = require("mongoose")
const user=require("./models/users")
const jw=require("jsonwebtoken")
const cors= require("cors")
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5174', // Allow this origin to access your API
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

 

dotenv.config(); 
const mongourl='mongodb://mernchat:<dcnedjbckedmcnjzmcsjvcjsbcksbchscsnmm>@cluster0.mongodb.net/?ssl=true&replicaSet=atlas-12phce-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
}).then(() => {
    console.log("MongoDB connected");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

console.log(process.env.MONGO_URL)
const secretjwt =process.env.JWT_SECRET;
app.get('/', (req, res) => {

    res.send('Welcome to the API');
});
app.get("/register",(req,res)=>{
    res.json('test ok')
})
app.post("/register",async (req,res)=>{
    const  {username,password}= req.body; 
const createuser = await user.create({username,password});
try {
    const token = jw.sign({ userid: createuser._id }, secretjwt);
    res.cookie('token', token).status(201).json({
        _id: createuser._id 
    }) ;
    console.log("run");
} catch (err) {
    console.error(err);
    res.status(500).json('Error signing token');
}


   
})
app.listen(3000,()=>{
    console.log("started")
})
/* gvvb3B0nMoKU16EM      mongoose.connect( process.env.MONGO_URL ); */