import express from 'express'
import router from './routes/auth';
import mongoose from 'mongoose';
import cors from 'cors';
import router1 from './routes/account';
const app=express();
const mongoURI='mongodb+srv://sachinprogramming62:H3lEBoO8FArmabQs@cluster0.rpgov.mongodb.net/PhonePay';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
app.use(cors());
app.use(express.json());
app.use('/auth',router);
app.use('/account',router1);
app.listen(3000,()=>{
    console.log("Server is runnning");
})