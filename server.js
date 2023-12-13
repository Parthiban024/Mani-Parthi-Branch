import express,{json} from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import {fileURLToPath} from 'url';
import bodyParser from 'body-parser';
// import Attendance from './models/attendance.js';
import moment from 'moment';
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URI = process.env.ATLAS_URI;

mongoose.connect(URI,{
    useNewUrlParser : true,
    useUnifiedTopology: true
},err=>{
    if(err) throw err;
    console.log('Connected to MongoDB Atlas !!!')
})

app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())
app.use(passport.initialize());

// For Routing Purpose
import User from './routes/user.js'
import Analyst from './routes/analyst.js'
import Attendance from './routes/attendance.js';
import Billing from './routes/billing.js'
import Team from './routes/team.js'
import Task from './routes/task.js'
// For Routers
app.use('/authentication/user',User);
app.use('/analyst',Analyst);
app.use('/emp-attendance',Attendance);
app.use('/billing',Billing);
app.use('/team',Team);
app.use('/create-task',Task);
// app.post('/api/saveAttendance', async (req, res) => {
//     try {
//       const { checkInTime } = req.body;
  
//       // Format check-in time using moment.js with explicit format
//       const formattedCheckInTime = moment(checkInTime, 'hh:mm a').format('hh:mm a');
  
//       // Save check-in time to MongoDB
//       const attendance = new Attendance({
//         checkInTime: formattedCheckInTime,
//       });
  
//       await attendance.save();
  
//       res.status(201).json({ message: 'Check-in time saved successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
  
//   // Endpoint to save check-out time
//   app.post('/api/saveCheckout', async (req, res) => {
//     try {
//       const { checkOutTime } = req.body;
  
//       // Format check-out time using moment.js with explicit format
//       const formattedCheckOutTime = moment(checkOutTime, 'hh:mm a').format('hh:mm a');
  
//       // Save check-out time to MongoDB
//       const attendance = new Attendance({
//         checkOutTime: formattedCheckOutTime,
//       });
  
//       await attendance.save();
  
//       res.status(201).json({ message: 'Checkout time saved successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

  // Endpoint to get the latest attendance data
// app.get('/api/getAttendance', async (req, res) => {
//     try {
//       const latestAttendance = await Attendance.findOne({}, {}, { sort: { 'checkinTime': -1 } });
  
//       if (latestAttendance) {
//         res.status(200).json({
//           checkinTime: moment(latestAttendance.checkinTime).format(),
//           checkoutTime: latestAttendance.checkoutTime ? moment(latestAttendance.checkoutTime).format() : null,
//         });
//       } else {
//         res.status(404).json({ message: 'No attendance data found' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });


//    For build
app.use(express.static(path.join(__dirname , 'client/build')))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname , '/client/build','index.html'));
});
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(port,()=>{
    console.log(`Server Running On Port : ${port}`);
});