import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton/index";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { updateUserName, updateUserEmpId } from './userActions';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import DatePicker from 'react-datepicker';
import checkinImage from '../images/check-in.png'
import checkoutImage from '../images/check-out.png';


function Attendance() {
  const dispatch = useDispatch();
  const [checkinTime, setCheckinTime] = useState(localStorage.getItem("checkinTime") || "");
  const [checkoutTime, setCheckoutTime] = useState(localStorage.getItem("checkoutTime") || "");
  const [checkinTimeForCheckout, setCheckinTimeForCheckout] = useState('');
  const [total, setTotal] = useState(localStorage.getItem('total') || '');
  const [remainingTime, setRemainingTime] = useState();
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Fetch data on component mount
    fetch(`/attendance/fetch/att-data?empId=${empId}`)
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((item) => ({ ...item, id: item._id }));
        setAttendanceData(mappedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [empId]);

  const columns = [
    { field: 'id', headerName: 'ID',  editable: false },
    { field: 'checkInTime', headerName: 'Check In', width: 150,  flex: 1 },
    { field: 'checkOutTime', headerName: 'Check Out', width: 150,  flex: 1 },
    { field: 'total', headerName: 'Total', width: 150,  flex: 1 },
    {
      field: 'currentDate',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => moment(params.row.currentDate).format('YYYY-MM-DD'),
    },
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
  
    localStorage.setItem("checkinTime", timeNow);
    localStorage.setItem("name", name);
    localStorage.setItem("empId", empId);
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
      const response = await fetch('/attendance/att', {
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
        const resetIntervalId = setInterval(() => {
          setCheckinTime('');
          setCheckoutTime('');
          setTotal('');
          setRemainingTime('');
          localStorage.removeItem('checkinTime');
          localStorage.removeItem('checkoutTime');
          localStorage.removeItem('total');
          clearInterval(resetIntervalId);
        }, 1000);
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
      <Grid item xs={12} mt={1} >
        <MDBox mt={2} mb={2}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
             
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <MDTypography mb={3} style={{  marginRight: '80px' }} variant="caption" color="info" fontWeight="regular">
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
        <img
          src={checkinImage}
          alt="Check In"
          display='flex'
          style={{ cursor: 'pointer', marginBottom: '16px', marginLeft: '100px', width: '100%', maxWidth: '100px' }}
          onClick={handleCheckin}
          disabled={!!checkinTime}
        />
        <MDBox display="flex" flexDirection="column">
          <MDTypography mt={3} variant="caption" color="dark" fontWeight="regular" style={{  marginLeft: '90px' }}>
            <h3>Check-In Time: {checkinTime}</h3>
          </MDTypography>
        </MDBox>
      </Grid>
      <Grid mt={3} item xs={12} md={6} lg={4}>
        <img
          src={checkoutImage}
          alt="Check Out"
          style={{ cursor: 'pointer', marginBottom: '16px', width: '100%', maxWidth: '100px' }}
          onClick={handleCheckout}
          disabled={!!checkoutTime}
        />
        <MDBox display="flex" flexDirection="column">
          <MDTypography mt={3} variant="caption" color="dark" fontWeight="regular" style={{  marginLeft: '0px' }}>
            <h3>Check-Out Time: {checkoutTime}</h3>
          </MDTypography>
        </MDBox>
      </Grid>

                  </MDBox>
                </MDBox>
                <MDBox mt={4} px={10} display="flex" flexDirection="column">
                  <MDTypography mb={1} variant="h6" color="info" fontWeight="regular" style={{  marginLeft: '70px' }}>
                    <h3>Working Hours: {total}</h3>
                  </MDTypography>
                </MDBox>
                {/* <MDBox mt={4} px={10} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                  <MDTypography mb={3} variant="caption" color="error" fontWeight="regular">
                    <h1>🚧 Under Development Process 🚧</h1>
                  </MDTypography>
                </MDBox> */}
             
            </Grid>
          </Grid>
        </MDBox>
      </Grid>

      <Grid>
      <Card>
        {/* Date Picker for filtering */}
        {/* <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          isClearable
          placeholderText="Select Date"
        /> */}

        {/* DataGrid for displaying attendance data */}
        
        <div style={{ height: 370, width: '100%' }}>
         
          <DataGrid rows={mappedData} columns={columns} pageSize={5} />
        
        </div>
        </Card>
      </Grid>

      <Footer />
    </DashboardLayout>
  );
}

export default Attendance;
