import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
// import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function Attendance() {
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);

  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetch(`/emp-attendance`)
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((item, index) => ({ ...item, id: index + 1 }));
        setAttendanceData(mappedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'empId', headerName: 'Employee ID', width: 150, flex: 1 },
    { field: 'checkInTime', headerName: 'Check In', width: 150, flex: 1 },
    { field: 'checkOutTime', headerName: 'Check Out', width: 150 },
    { field: 'total', headerName: 'Total', width: 150 },
    {
        field: 'currentDate',
        headerName: 'Date',
        width: 150,
        valueGetter: (params) => moment(params.row.currentDate).format('YYYY-MM-DD'),
      },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <Grid item xs={12} mt={1} >
        <MDBox mt={4} mb={8}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Card mb={3}>
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MDTypography mt={2} mb={3} variant="caption" color="info" fontWeight="regular">
                    <h1>Employee Attendance</h1>
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </Grid> */}

      <Grid mt={4} mb={10}>
        <Card>
        <div style={{ height: 370, width: '100%' }}>
          <DataGrid rows={attendanceData} columns={columns} pageSize={5} />
        </div>
        </Card>
      </Grid>

     {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Attendance;
