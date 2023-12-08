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
    fetch(`/attendance/fetch/att-data?empId=${empId}`)
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((item) => ({ ...item, id: item._id }));
        setAttendanceData(mappedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [empId]);

  const columns = [
    { field: 'id', headerName: 'ID',  editable: false,
   },
    // { field: 'name', headerName: 'Name', width: 120 }, // Add this line
    // { field: 'empId', headerName: 'Employee ID', width: 120 }, // Add this line
    { field: 'checkInTime', headerName: 'Check In', width: 150,  flex: 1,  },
    { field: 'checkOutTime', headerName: 'Check Out', width: 150,  flex: 1,  },
    { field: 'total', headerName: 'Total', width: 150,  flex: 1,  },
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
  // const filteredData = selectedDate
  //   ? mappedData.filter((entry) => entry.currentDate.includes(selectedDate))
  //   : mappedData;

  const handleCheckin = async () => {
    const timeNow = moment().format('hh:mm a');
    setCheckinTime(timeNow);
    setCheckinTimeForCheckout(timeNow); // Store check-in time for later use in checkout

    // Save data to local storage
    localStorage.setItem("checkinTime", timeNow);
    localStorage.setItem("name", name);
    localStorage.setItem("empId", empId);

    // Send data to the backend
    // try {
    //   const response = await fetch('/attendance/att', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ checkInTime: timeNow, name: name, empId: empId }),
    //   });

    //   if (response.ok) {
    //     console.log('Attendance saved successfully');
    //   } else {
    //     console.error('Failed to save attendance');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };

  const handleCheckout = async () => {
    const checkTime = moment().format('hh:mm a');
    setCheckoutTime(checkTime);

    const checkinMoment = moment(checkinTimeForCheckout, 'hh:mm a'); // Use stored check-in time
    const checkoutMoment = moment(checkTime, 'hh:mm a');
    const overAll = moment.duration(checkoutMoment.diff(checkinMoment));

    // Update the state
    setTotal(`${overAll.hours()}hrs : ${overAll.minutes()}mins`);

    // Send data to the backend
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
          checkInTime: checkinTimeForCheckout, // Use stored check-in time
          checkOutTime: checkTime,
          name: name,
          empId: empId,
          total: `${overAll.hours()}hrs : ${overAll.minutes()}mins`,
        }),
      });

      if (response.ok) {
        console.log('Checkout time saved successfully');
      } else {
        console.error('Failed to save checkout time');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetStateAndButtons = () => {
    setCheckinTime('');
    setCheckoutTime('');
    setTotal('');
    setRemainingTime('');
    localStorage.removeItem('checkinTime');
    localStorage.removeItem('checkoutTime');
    localStorage.removeItem('total');
  };

  useEffect(() => {
    const intervalId = setInterval(resetStateAndButtons, 60000);
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const totalResetIntervalId = setInterval(() => {
      localStorage.removeItem('total');
      setTotal('');
    }, 60000);

    return () => clearInterval(totalResetIntervalId); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const storedCheckinTime = localStorage.getItem("checkinTime");
    const storedCheckoutTime = localStorage.getItem("checkoutTime");
    const storedTotal = localStorage.getItem('total');
    const storedName = localStorage.getItem("name");
    const storedEmpId = localStorage.getItem("empId");

    if (storedName) {
      dispatch(updateUserName(storedName));

      if (storedEmpId) {
        dispatch(updateUserEmpId(storedEmpId));
      }

      if (storedTotal) {
        setTotal(storedTotal);
      }
    }

    if (storedCheckinTime) {
      setCheckinTime(storedCheckinTime);
    }

    if (storedCheckoutTime) {
      setCheckoutTime(storedCheckoutTime);
    }
  }, [dispatch]);

  const calculateRemainingTime = () => {
    const timeNow = moment();
    const checkinMoment = moment(checkinTime, 'hh:mm a');
    const checkoutMoment = moment(checkoutTime, 'hh:mm a');

    const remainingDuration = checkoutMoment.diff(timeNow);
    const remaining = moment.duration(remainingDuration);

    setRemainingTime(`${remaining.hours()}hrs : ${remaining.minutes()}mins`);
  };

  useEffect(() => {
    const remainingIntervalId = setInterval(calculateRemainingTime, 60000);
    return () => clearInterval(remainingIntervalId);
  }, [checkinTime, checkoutTime]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid item xs={12} mt={1} >
        <MDBox mt={4} mb={2}>
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
                  <MDBox
                    display="flex"
                    width="850px"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-evenly"
                  >
                    <Grid mt={3} item xs={12} md={6} lg={4}>
                      <MDButton
                        mb={3}
                        type="submit"
                        color="info"
                        onClick={handleCheckin}
                        disabled={!!checkinTime}
                      >
                        Check In!
                      </MDButton>
                      <MDBox display="flex" flexDirection="column">
                        <MDTypography
                          mt={3}
                          variant="caption"
                          color="dark"
                          fontWeight="regular"
                        >
                          <h3>Time: {checkinTime}</h3>
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid mt={3} item xs={12} md={6} lg={4}>
                      <MDButton
                        type="submit"
                        color="success"
                        onClick={handleCheckout}
                        disabled={!!checkoutTime}
                      >
                        Check out!
                      </MDButton>
                      <MDBox display="flex" flexDirection="column">
                        <MDTypography
                          mt={3}
                          variant="caption"
                          color="dark"
                          fontWeight="regular"
                        >
                          <h3>Time: {checkoutTime}</h3>
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </MDBox>
                </MDBox>
                <MDBox mt={4} px={10} display="flex" flexDirection="column">
                  <MDTypography mb={1} variant="caption" color="dark" fontWeight="regular">
                    <h3>Over All Time: {total}</h3>
                  </MDTypography>
                </MDBox>
                <MDBox mt={4} px={10} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                  <MDTypography mb={3} variant="caption" color="error" fontWeight="regular">
                    <h1>🚧 Under Development Process 🚧</h1>
                  </MDTypography>
                </MDBox>
              </Card>
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
