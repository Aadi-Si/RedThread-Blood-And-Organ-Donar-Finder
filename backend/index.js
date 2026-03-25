require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();

const allowedOrigins = [
    "https://red-thread-blood-and-organ-donar-fi.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,credentials:true
}))

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth')
const donorRoutes = require('./routes/donor')
const hospitalRoutes = require('./routes/hospital')


app.use('/auth',authRoutes)
app.use('/donor', donorRoutes)
app.use('/hospital', hospitalRoutes)

app.get('/',(req,res)=>{
    res.json({message:'Server is running'});
})

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})