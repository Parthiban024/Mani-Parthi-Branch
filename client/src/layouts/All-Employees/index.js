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

const excelRowSchema = {
  employee_id: '',
  employee_name: '',
  department: '',
  role: '',
};

function Employees() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    employee_id: '',
    employee_name: '',
    department: '',
    role: '',
  });

  const [columns, setColumns] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    // Fetch initial data from MongoDB
    const fetchDataFromMongoDB = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/fetchData');
        const fetchData = await response.json();

        // Filter out "__v" field from columns
        const filteredColumns = fetchData.columns
          .filter((col) => col !== '__v')
          .map((col) => ({ field: col, headerName: col, width: 150 }));

        // Filter out "__v" field from rows
        const filteredRows = fetchData.rows.map((row) => {
          const { __v, ...rowDataWithoutV } = row;
          return rowDataWithoutV;
        });

        setColumns(filteredColumns);
        setData(filteredRows);
      } catch (error) {
        console.error('Error fetching data from MongoDB', error);
      }
    };

    fetchDataFromMongoDB();
  }, []);


  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setIsLoading(true);

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const binaryString = e.target.result;
          const workbook = read(binaryString, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const sheetData = utils.sheet_to_json(worksheet, { header: 1 });
          const sheetColumns = sheetData[0];

          // Validation function
          const validateSchema = (columns, schema) => {
            const schemaKeys = Object.keys(schema).map((key) => key.toLowerCase().replace(/\s+/g, '_'));
            console.log('Actual Schema Keys:', columns);
            console.log('Expected Schema Keys:', schemaKeys);

            // Check if all schema keys are present in columns
            return schemaKeys.every((key) => columns.some((col) => col.toLowerCase().replace(/\s+/g, '_') === key));
          };

          // Validate the schema
          if (!validateSchema(sheetColumns, excelRowSchema)) {
            console.error('Invalid Excel schema');
            setSnackbarMessage('Invalid Excel schema');
            setSnackbarOpen(true);
            setIsLoading(false);
            return;
          }

          const formattedData = sheetData.slice(1).map((row, index) => {
            const rowData = {};
            if (row.length > 0) {
              row.forEach((cell, i) => {
                const columnName = sheetColumns[i].toLowerCase().replace(/\s+/g, '_');
                rowData[columnName] = cell;
              });
              rowData.id = index + 1;
            }
            return rowData;
          });

          setColumns(sheetColumns.map((col) => ({ field: col, headerName: col, width: 150 })));
          setData(formattedData);

          // Save the data to MongoDB
          const response = await fetch('http://localhost:5000/api/uploadData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),
          });

          if (response.ok) {
            setSnackbarMessage('Data saved to MongoDB');

            // Fetch the data from MongoDB
            const fetchDataResponse = await fetch('http://localhost:5000/api/fetchData');
            const fetchData = await fetchDataResponse.json();

            setColumns(fetchData.columns.map((col) => ({ field: col, headerName: col, width: 150 })));
            setData(fetchData.rows);

            setSnackbarOpen(true);
          } else {
            setSnackbarMessage('Failed to save data to MongoDB');
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error('Error processing Excel file or communicating with the server', error);
          setSnackbarMessage('Error processing Excel file or communicating with the server');
          setSnackbarOpen(true);
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    // Reset the new employee data when closing the form
    setNewEmployeeData({
      employee_id: '',
      employee_name: '',
      department: '',
      role: '',
    });
  };

  const handleAddEmployee = async () => {
    try {
      setIsLoading(true);

      // Save the new employee data to MongoDB
      const response = await fetch('http://localhost:5000/api/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployeeData),
      });

      if (response.ok) {
        setSnackbarMessage('Employee added successfully');

        // Fetch the updated data from MongoDB
        const fetchDataResponse = await fetch('http://localhost:5000/api/fetchData');
        const fetchData = await fetchDataResponse.json();

        setColumns(fetchData.columns.map((col) => ({ field: col, headerName: col, width: 150 })));
        setData(fetchData.rows);

        setSnackbarOpen(true);
        setIsFormOpen(false); // Close the form after adding an employee
      } else {
        setSnackbarMessage('Failed to add employee');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error adding employee or communicating with the server', error);
      setSnackbarMessage('Error adding employee or communicating with the server');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      setIsLoading(true);

      // Delete the employee data from MongoDB
      const response = await fetch(`http://localhost:5000/api/deleteEmployee/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbarMessage('Employee deleted successfully');

        // Fetch the updated data from MongoDB
        const fetchDataResponse = await fetch('http://localhost:5000/api/fetchData');
        const fetchData = await fetchDataResponse.json();

        setColumns(fetchData.columns.map((col) => ({ field: col, headerName: col, width: 150 })));
        setData(fetchData.rows);

        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Failed to delete employee');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting employee or communicating with the server', error);
      setSnackbarMessage('Error deleting employee or communicating with the server');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateEmployee = async () => {
    try {
      setIsLoading(true);

      // Update the employee data in MongoDB
      const response = await fetch(`http://localhost:5000/api/updateEmployee/${selectedEmployeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployeeData),
      });

      if (response.ok) {
        setSnackbarMessage('Employee updated successfully');

        // Fetch the updated data from MongoDB
        const fetchDataResponse = await fetch('http://localhost:5000/api/fetchData');
        const fetchData = await fetchDataResponse.json();

        setColumns(fetchData.columns.map((col) => ({ field: col, headerName: col, width: 150 })));
        setData(fetchData.rows);

        setSnackbarOpen(true);
        setIsFormOpen(false); // Close the form after updating an employee
      } else {
        setSnackbarMessage('Failed to update employee');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating employee or communicating with the server', error);
      setSnackbarMessage('Error updating employee or communicating with the server');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEmployee = (id) => {
    // Find the selected employee from the data
    const selectedEmployee = data.find((emp) => emp.id === id);

    // Open the form with the existing data for editing
    setNewEmployeeData({ ...selectedEmployee });
    setSelectedEmployeeId(id);
    setIsFormOpen(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button component="span" variant="contained" color="primary">
                Upload Excel
              </Button>
            </label>
            <Button variant="contained" color="primary" onClick={handleOpenForm}>
              Add Employee
            </Button>
            {isLoading && <CircularProgress />}
            {!isLoading && (
              <div style={{ height: 370, width: '100%' }}>
                <DataGrid
                  rows={data}
                  columns={[
                    ...columns,
                    {
                      field: 'actions',
                      headerName: 'Actions',
                      width: 150,
                      renderCell: (params) => (
                        <>
                          <IconButton color="secondary" onClick={() => handleDeleteEmployee(params.id)}>
                            <DeleteIcon />
                          </IconButton> 
                          <IconButton color="primary" onClick={() => handleEditEmployee(params.id)}>
                            <EditIcon />
                          </IconButton>
                        </>
                      ),
                    },
                  ]}
                  pageSize={5}
                  checkboxSelection
                  components={{
                    Toolbar: () => (
  
    
                        <GridToolbar />
                    ),
                  }}
                />
              </div>
            )}
          </Card>
        </Grid>

        <Dialog open={isFormOpen} onClose={handleCloseForm}>
          <DialogTitle>{selectedEmployeeId ? 'Update Employee' : 'Add Employee'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Employee ID"
              value={newEmployeeData.employee_id}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, employee_id: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Employee Name"
              value={newEmployeeData.employee_name}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, employee_name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Department"
              value={newEmployeeData.department}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, department: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Role"
              value={newEmployeeData.role}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, role: e.target.value })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} color="primary">
              Cancel
            </Button>
            <Button
              onClick={selectedEmployeeId ? handleUpdateEmployee : handleAddEmployee}
              color="primary"
            >
              {selectedEmployeeId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Grid>
    </DashboardLayout>
  );
}


export default Employees;
