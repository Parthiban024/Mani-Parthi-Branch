import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  
  emp_name: String,
  emp_id: String,
  joined_on: String,
  report_to: String,
  designation: String,
  email_id: String,
  date_of_birth: String,
  gender: String,
    // department: String,
  // doj: String, // Assuming DOJ is a date field
  // gender: String,
  // dob: String, // Assuming DOB is a date field
  // status: String,
  // confirmation_date: String, // Assuming Confirmation Date is a date field
  // age_range: String,
  // manager_id: String,
  // manager_name: String,
  // phone_no: String,
  // blood_group: String,
  // employment_status: String,
  // pan_no: String,
  // uan_no: String,
  // marital_status: String,
  // bank_ac_no: String,
  // nationality: String,
  // age: String,
  // current_access_card_no: String,
  // residential_status: String,
  // location: String,
  // grade: String,
  // shift: String,
  
    });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
