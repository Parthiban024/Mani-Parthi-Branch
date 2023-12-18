import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  empId: String,
  empName: String,
  DOJ: Date, // Assuming DOJ is a date field
  gender: String,
  DOB: Date, // Assuming DOB is a date field
  emailId: String,
  status: String,
  confirmationDate: Date, // Assuming Confirmation Date is a date field
  ageRange: String,
  managerId: String,
  managerName: String,
  phoneNo: String,
  bloodGroup: String,
  employmentStatus: String,
  panNo: String,
  uanNo: String,
  maritalStatus: String,
  bankAccountNo: String,
  nationality: String,
  age: Number,
  currentAccessCardNo: String,
  residentialStatus: String,
  location: String,
  designation: String,
  department: String,
  grade: String,
  shift: String,
    });

const EmployeeUpload = mongoose.model('Employeeupload', employeeSchema);

export default EmployeeUpload;
