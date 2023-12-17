import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
     employee_id: {
        type: String,
        required: true,
      },
      employee_name: {
        type: String,
        required: true, 
      },
      department: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
    });

const EmployeeUpload = mongoose.model('Employeeupload', employeeSchema);

export default EmployeeUpload;
