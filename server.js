import express, { json } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
// import Attendance from './models/attendance.js';
import EmployeeUpload from './models/excelUpload.js';
import { read, utils } from 'xlsx';
import Employee from './models/excelUpload.js'; 


import moment from 'moment';
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URI = process.env.ATLAS_URI;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if (err) throw err;
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
app.use('/authentication/user', User);
app.use('/analyst', Analyst);
app.use('/emp-attendance', Attendance);
app.use('/billing', Billing);
app.use('/team', Team);
app.use('/create', Task);
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

// MongoDB Schema
// const employeeSchema = new mongoose.Schema({
//   emp_id: String,
//   emp_name: String,
//   department: String,
//   email_id: String,
//   doj: String, // Assuming DOJ is a date field
//   gender: String,
//   dob: String, // Assuming DOB is a date field
//   status: String,
//   confirmation_date: String, // Assuming Confirmation Date is a date field
//   age_range: String,
//   manager_id: String,
//   manager_name: String,
//   phone_no: String,
//   blood_group: String,
//   employment_status: String,
//   pan_no: String,
//   uan_no: String,
//   marital_status: String,
//   bank_ac_no: String,
//   nationality: String,
//   age: String,
//   current_access_card_no: String,
//   residential_status: String,
//   location: String,
//   designation: String,
//   grade: String,
//   shift: String,
// });

// const Employee = mongoose.model('Employee', employeeSchema);

app.post('/api/uploadData', async (req, res) => {
  try {
    const data = req.body;

    await Employee.insertMany(data);

    res.status(200).json({ message: 'Data saved to MongoDB' });
  } catch (error) {
    console.error('Error saving data to MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API to fetch data from MongoDB
app.get('/api/fetchData', async (req, res) => {
  try {
    const employees = await Employee.find({});
    const columns = Object.keys(Employee.schema.paths).filter((col) => col !== '_id');
    const rows = employees.map((emp) => ({ ...emp.toObject(), id: emp._id }));

    res.status(200).json({ columns, rows });
  } catch (error) {
    console.error('Error fetching data from MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API to add employee to MongoDB
app.post('/api/addEmployee', async (req, res) => {
  try {
    const newEmployeeData = req.body;
    const newEmployee = new Employee(newEmployeeData);
    await newEmployee.save();

    res.status(200).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee to MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API to delete employee from MongoDB
app.delete('/api/deleteEmployee/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee from MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// API to update employee in MongoDB
app.put('/api/updateEmployee/:id', async (req, res) => {
  const { id } = req.params;
  const updatedEmployeeData = req.body;

  try {
    await Employee.findByIdAndUpdate(id, updatedEmployeeData);
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee in MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//    For build
app.use(express.static(path.join(__dirname, 'client/build')))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(port, () => {
  console.log(`Server Running On Port : ${port}`);
});