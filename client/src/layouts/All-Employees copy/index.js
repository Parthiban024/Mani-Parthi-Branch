// src/pages/Employees.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Button,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { read, utils } from 'xlsx';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import MDButton from "components/MDButton";



function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/upload', formData);

      // Assuming the response contains the updated employee data
      setEmployees(response.data);

      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  return (
    <DashboardLayout>
    <DashboardNavbar />
    <div>
      <input type="file" onChange={handleFileUpload} />

      {/* Display employee data in a table */}
      <DataGrid
        rows={employees}
        columns={[/* Define columns */]}
        components={{
          Toolbar: GridToolbar,
        }}
        onRowClick={(params) => handleEdit(params.row)}
      />

      {/* Employee Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <TextField label="Employee Name" value={selectedEmployee.name} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenDialog(false)}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  </DashboardLayout>
);
}

export default Employees;
