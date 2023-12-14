import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton/index";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// import Footer from "examples/Footer";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { updateUserName, updateUserEmpId } from './userActions';
import { useDispatch } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DatePicker from 'react-datepicker';
import checkinImage from '../images/check-in.png'
import checkoutImage from '../images/check-out.png';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';



function Attendance() {
  const dispatch = useDispatch();
  const [checkinTime, setCheckinTime] = useState(localStorage.getItem('checkinTime') || '');
  const [checkoutTime, setCheckoutTime] = useState(localStorage.getItem('checkoutTime') || '');
  const [checkinTimeForCheckout, setCheckinTimeForCheckout] = useState('');
  const [total, setTotal] = useState(localStorage.getItem('total') || '');
  const [remainingTime, setRemainingTime] = useState('');
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);


  
  useEffect(() => {
    fetchData(); // Initial data fetch
  }, [empId, selectedDate]);


  const fetchData = async () => {
    try {
      const response = await fetch(`/emp-attendance/fetch/att-data?empId=${empId}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      const mappedData = data.map((item) => ({ ...item, id: item._id }));

        // Filter data based on selected date if it's set
        const filteredData = selectedDate
          ? mappedData.filter((item) => moment(item.currentDate).isSame(selectedDate, "day"))
          : mappedData;

        setAttendanceData(filteredData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [empId, selectedDate]);

  const columns = [
    { field: 'id', headerName: 'S.No', editable: false },
    {
      field: 'currentDate',
      headerName: 'Date',
      width: 200,
      valueGetter: (params) => moment(params.row.currentDate).format('YYYY-MM-DD'),
    },
    { field: 'checkInTime', headerName: 'First In', width: 120, flex: 1 },
    { field: 'checkOutTime', headerName: 'Last Out', width: 120, flex: 1 },
    { field: 'total', headerName: 'Total Work Hrs', width: 120, flex: 1 },

  ];

  const mappedData = attendanceData.map((item, index) => ({
    ...item,
    id: index + 1,
    name: item.name,
    empId: item.empId,
  }));



  const handleCheckin = async () => {
    const timeNow = moment().format('hh:mm a');
    setCheckinTime(timeNow);
    setCheckinTimeForCheckout(timeNow); // Set checkinTimeForCheckout here

    sessionStorage.setItem("checkinTime", timeNow);
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("empId", empId);
  };

  const handleCheckout = async () => {
    const checkTime = moment().format('hh:mm a');
    setCheckoutTime(checkTime);

    // Ensure checkinTimeForCheckout is set correctly, use the current time if not set
    const checkinMoment = moment(checkinTimeForCheckout || moment(), 'hh:mm a');
    const checkoutMoment = moment(checkTime, 'hh:mm a');
    const overAll = moment.duration(checkoutMoment.diff(checkinMoment));

    setTotal(`${overAll.hours()}hrs : ${overAll.minutes()}mins`);

    localStorage.setItem("checkoutTime", checkTime);
    localStorage.setItem("name", name);
    localStorage.setItem("empId", empId);
    localStorage.setItem('total', `${overAll.hours()}hrs : ${overAll.minutes()}mins`);

    try {
      const response = await fetch('/emp-attendance/att', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkInTime: checkinTimeForCheckout || checkTime, // Use stored check-in time or current time
          checkOutTime: checkTime,
          name: name,
          empId: empId,
          total: `${overAll.hours()}hrs : ${overAll.minutes()}mins`,
        }),
      });

      if (response.ok) {
        console.log('Checkout time saved successfully');

        // Reset function logic
        setResetTimeoutId(setTimeout(resetFunction, 120000));
      } else {
        console.error('Failed to save checkout time');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid item xs={12} mt={1} mb={4} >
        <MDBox mt={2} mb={2}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>

              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
              >
                <MDTypography mb={3} style={{ marginRight: '80px' }} variant="caption" color="info" fontWeight="regular">
                  <h1>Employee Attendance</h1>
                </MDTypography>
                <MDBox
                  display="flex"
                  width="850px"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-evenly"
                >
                  <Grid mt={3} item xs={12} md={6} lg={4}>
                    <MDButton type="submit"
                      // color="info"
                      onClick={handleCheckin}
                      disabled={!!checkinTime}
                      style={{ marginLeft: '100px' }}
                    >

                      <img
                        src={checkinImage}
                        alt="Check In"
                        display='flex'
                        style={{ cursor: 'pointer', marginBottom: '16px', width: '100%', maxWidth: '100px' }}
                      // onClick={handleCheckin}
                      // disabled={!!checkinTime}
                      />
                    </MDButton>
                    <MDBox display="flex" flexDirection="column">
                      <MDTypography mt={3} variant="caption" color="dark" fontWeight="regular" style={{ marginLeft: '90px' }}>
                        <h3>Check-In Time: {checkinTime}</h3>
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid mt={3} item xs={12} md={6} lg={4}>
                    <MDButton
                      type="submit"
                      // color="success"
                      onClick={handleCheckout}
                      disabled={!!checkoutTime}
                    >
                      <img
                        src={checkoutImage}
                        alt="Check Out"
                        style={{ cursor: 'pointer', marginBottom: '16px', width: '100%', maxWidth: '100px' }}
                      // onClick={handleCheckout}
                      // disabled={!!checkoutTime}
                      />
                    </MDButton>
                    <MDBox display="flex" flexDirection="column">
                      <MDTypography mt={3} variant="caption" color="dark" fontWeight="regular" style={{ marginLeft: '0px' }}>
                        <h3>Check-Out Time: {checkoutTime}</h3>
                      </MDTypography>
                    </MDBox>
                  </Grid>

                </MDBox>
              </MDBox>
              {/* <MDBox mt={4} px={10} display="flex" flexDirection="column">
                <MDTypography mb={1} variant="h6" color="info" fontWeight="regular" style={{ marginLeft: '70px' }}>
                  <h3>Working Hours: {total}</h3>
                </MDTypography>
              </MDBox> */}
              {/* <MDBox mt={4} px={10} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                  <MDTypography mb={3} variant="caption" color="error" fontWeight="regular">
                    <h1>🚧 Under Development Process 🚧</h1>
                  </MDTypography>
                </MDBox> */}

            </Grid>
          </Grid>
        </MDBox>
      </Grid>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={4}>
          {/* <Card> */}
          <MDBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Calendar
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              isClearable
              style={{ width: '600px !important' }}
            />
          </MDBox>
          {/* </Card> */}
        </Grid>
        <Grid item xs={12} lg={8}>
          <Card>
            <div style={{ height: 370, width: '100%' }}>
              <DataGrid rows={mappedData} columns={columns} pageSize={5} 
              // components={{
              //   Toolbar: () => (
              //     <GridToolbar />
              //   ),
              // }}
               />
            </div>
          </Card>
        </Grid>
      </Grid>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Attendance;
