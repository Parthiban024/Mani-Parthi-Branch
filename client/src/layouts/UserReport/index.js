import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import * as React from "react";
import { DataGrid, GridToolbar, GridPagination } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useMemo, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useSelector } from "react-redux";
import axios from "axios";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import moment from "moment";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useSelect } from "@mui/base";
import { ToastContainer, toast } from "react-toastify";
import InputLabel from "@mui/material/InputLabel";
import Pagination from '@mui/material/Pagination';
import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
function Report() {


  // task page code start
  const [data, setData] = useState([]);
  const [disable, setDisable] = useState(true);
  // const [seconds, setSeconds] = useState({ TotalTime: "", ActiveTime: "", EntityTime: "" });
  // const [timeData, setTimeData] = useState({ TotalTime: "", ActiveTime: "", EntityTime: "" });
  // const [count, setCount] = useState({ aTotal: "" });
  const [teamlist, setTeamlist] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [managers, setManagers] = useState([]);
  const name = useSelector((state) => state.auth.user.name);
  const empid = useSelector((state) => state.auth.user.empId);
  const initialvalues = {
    team: "",
    projectName: "",
    task: "",
    managerTask: "",
    dateTask: "",
    sessionOne: "",
    sessionMinute: ""
    // sessionTwo: 0,
    // others: 0,
    // comments: "",

  };
  const [value, setValue] = useState(initialvalues);
  const handleTeamchange = (event, value) => setTeamlist(value);
  const handleTaskChange = (event, value) => setTaskList(value);
  const handleInputchange = (e) => {
    const { name, value: inputValue } = e.target;

    setValue((prevValue) => ({
      ...prevValue,
      [name]: inputValue,
    }));
  };

  // const handleInputchange = (e) => {
  //   if (e.target) {
  //     const { name, value: inputValue } = e.target;
  //     setValue((prevValue) => ({
  //       ...prevValue,
  //       [name]: inputValue,
  //     }));
  //   }
  // };
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to handle opening the drawer
  const openDrawer = () => {
    setDrawerOpen(true);
  };

  // Function to handle closing the drawer
  const closeDrawer = () => {
    setDrawerOpen(false);

    // Reset project name and managerTask when the drawer is closed
    setValue((prevValues) => ({
      ...prevValues,
      projectName: '',
      managerTask: '',
      sessionOne: '',
      sessionMinute: ''
    }));
  };



  // Fetch task data
  useEffect(() => {
    // Assuming you have an API endpoint to fetch task data
    axios.get("/create-task/fetch/task-data").then((response) => {
      setTaskList(response.data);
    });
  }, []);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Function to handle opening the filter popup
  const openFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  // Function to handle closing the filter popup
  const closeFilterDialog = () => {
    setFilterDialogOpen(false);
  };
  const handleCancel = () => {
    // Reset all fields to their initial values
    setValues(initialValues);
    setTeamList(null);

    // Close the filter popup
    closeFilterDialog();
  };

  // Define getCurrentDate function
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    axios.get("/billing/").then((response) => {
      const projects = response.data.map((item) => item.projectname);
      const managers = response.data.map((item) => item.jobs?.managerTeam).filter(Boolean);

      setProjectNames(projects);
      setManagers(managers);

      const currentDate = getCurrentDate();

      // Find the selected project in the response data
      const selectedProject = response.data.find((item) => item.projectname === value.projectName);

      if (selectedProject) {
        const projectManager = selectedProject.jobs?.managerTeam;
        const projectTeam = selectedProject.team; // Assuming the team information is available in the API response

        setValue((prevValues) => ({
          ...prevValues,
          dateTask: currentDate,
          managerTask: projectManager || '',
          team: projectTeam || '', // Set the team based on the selected project
        }));
      } else {
        // Reset date, manager, and team when another project name is selected
        setValue((prevValues) => ({
          ...prevValues,
          dateTask: '',
          managerTask: '',
          team: '', // Reset team value
        }));
      }
    });
  }, [value.projectName]);

  // file handling         29/11/2023
  // const handlingFileUpload = (e) => {
  //   const { files } = e.target;
  //   setData([]);
  // console.log(files);
  // console.log(files[0]);
  //   papa.parse(files[0], {
  //     header: true,
  //     column: true,
  //     complete(results) {
  //       setData((existing) => [...existing, ...results.data]);
  //       return results.data;
  //     },
  //   });
  //   disable?setDisable(!disable):null
  // };

  // file handling
  // const handlingFileUpload = (e) => {
  //   const { files } = e.target;
  //   setData([]);
  //   papa.parse(files[0], {
  //     header: true,
  //     column: true,
  //     complete(results) {
  //       setData((existing) => [...existing, ...results.data]);
  //       return results.data;
  //     },
  //   });
  //   setDisable(!disable); // Updated this line
  // };

  // useEffect(() => {
  //   var assTotal =
  //   values.sessionOne + values.sessionTwo + values.others;
  //   setCount({
  //     ...count,
  //     aTotal: assTotal,
  //   });
  // }, [values]);
  // const calculateTotal = (value) => {
  //   const sessionOne = parseInt(value.sessionOne, 10) || 0;
  //   const sessionTwo = parseInt(value.sessionTwo, 10) || 0;
  //   const others = parseInt(value.others, 10) || 0;

  //   const total = sessionOne + sessionTwo + others;
  //   return isNaN(total) ? '' : total;
  // };

  // Upload Data
  const submit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      empId,
      team: value.team, // Use value.team instead of teamlist
      task: taskList,
      projectName: value.projectName,
      // task: values.task,
      managerTask: value.managerTask,
      dateTask: value.dateTask,
      // dailyLog: values.dailyLog,
      sessionOne: value.sessionOne,
      sessionMinute: value.sessionMinute,
      // sessionTwo: value.sessionTwo,
      // others: value.others,
      // comments: value.comments,
      // total: calculateTotal(value),

      // TotalTime: timeData.TotalTime,
      // ActiveTime: timeData.ActiveTime,
      // EntityTime: timeData.EntityTime,
    };

    axios
    .post("/analyst/add", userData)
    .then(() => {
      toast.success("Successfully Data Submitted 👌");
      closeDrawer();
      // Fetch data again after submitting a new task
      fetchData();
    })
    .catch((err) => toast.error(`Try Again Followed Error Acquired: ${err}☹️`));
  };

  // useEffect(() => {
  //   let activeTime = 0;
  //   let totalTime = 0;
  //   let entityTime = 0;
  //   data.map((item) => {
  //     if (item.URL.match(/sagemaker\.aws\/#\/work\//gm) !== null) {
  //       activeTime += Number(item["Active(sec)"]);
  //     }

  //     if (item.URL.match(/inAll/gm) !== null) {
  //       totalTime = Number(item["Active(sec)"]);
  //     }
  //     return null;
  //   });
  //   const active = convert(activeTime, "cal");
  //   const total = convert(totalTime, "cal");
  //   entityTime = totalTime - activeTime;
  //   const entity = convert(entityTime, "cal");
  //   // console.log(Object.keys(data).length);
  //   // console.log(totalTime);
  //   // console.log(activeTime);
  //   // console.log(entityTime);
  //   setSeconds({
  //     TotalTime: total,
  //     ActiveTime: active,
  //     EntityTime: entity,
  //   });
  //   setTimeData({
  //     TotalTime: totalTime,
  //     ActiveTime: activeTime,
  //     EntityTime: entityTime,
  //   });

  // }, [data]);
  // Team List


  const listtask = [
    "CV",
    "NLP",
    "CM",
  ];

  const tasklist = [
    "Initial Annotation-Billable",
    "QC Annotation-Billable",
    "Project Training-Billable",
    "Spot QC-Non Billable",
    "Other-Interval Tracking -Billable",

    "Guidelines",
    "POC"
  ];

  // task page code end

  // const { columns, rows } = authorsTableData();
  const initialValues = {
    startDate: "",
    endDate: "",
    empname: "",
    team: "",
  };
  const [values, setValues] = useState(initialValues);
  const [report, setReport] = useState([]);
  const [teamList, setTeamList] = useState(null);
  const empId = useSelector((state) => state.auth.user.empId);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleTeamChange = (event, value) => setTeamList(value);
  const [show, setShow] = useState(false);

  const [initialData, setInitialData] = useState([]);

  // Fetch initial data without filter
  // Fetch initial data
  useEffect(() => {
    axios.get(`/analyst/fetch/userdata/?empId=${empId}`).then((response) => {
      setInitialData(response.data);
    });
  }, [empId]);

  // Fetch data when a new task is submitted
  const fetchData = () => {
    axios
      .get(
        `analyst/fetch/user-data/?sDate=${values.startDate}&eDate=${values.endDate}&empId=${empId}&team=${teamList}`
      )
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => console.log(`Error:${err}`));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      startDate: values.startDate,
      endDate: values.endDate,
      team: teamList,

    };
    // console.log(userData);

    axios
      .get(
        `analyst/fetch/user-data/?sDate=${values.startDate}&eDate=${values.endDate}&empId=${empId}&team=${teamList}`
      )
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => console.log(`Error:${err}`));

    setValues(initialValues);
    setTeamList(null);

    closeFilterDialog();
  };

  // tabel report

  const initialDataColumns = [
    {
      field: "name",
      headerName: "Name",
      width: 50,
      editable: false,
      flex: 1,
    },
    {
      field: "team",
      headerName: "Team",
      width: 50,
      editable: false,
      flex: 1,
    },
    {
      field: "dateTask",
      headerName: "Date",
      width: 130,
      editable: false,
      flex: 1,
      valueFormatter: (params) => {
        return moment(params.value).format("DD-MM-YYYY");
      },
    },
    {
      field: "projectName",
      headerName: "Project Name",
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "task",
      headerName: "Task",
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "managerTask",
      headerName: "Project Manager",
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "sessionOne",
      headerName: "Hours",
      width: 110,
      editable: false,
    },
    {
      field: "sessionMinute",
      headerName: "Minutes",
      width: 110,
      editable: false,

    },
  ];
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    ...initialDataColumns,
  ];

  const rows = useMemo(
    () =>
      report.map((item, index) => ({
        ...item,
        id: index + 1,
        name: item.name,
        team: item.team,
        date: moment(item.createdAt).format("DD-MM-YYYY"),
        // TotalTime: moment
        //   .utc(moment.duration(item.TotalTime, "seconds").as("milliseconds"))
        //   .format("HH:mm:ss"),
        // ActiveTime: moment
        //   .utc(moment.duration(item.ActiveTime, "seconds").as("milliseconds"))
        //   .format("HH:mm:ss"),
        // EntityTime: moment
        //   .utc(moment.duration(item.EntityTime, "seconds").as("milliseconds"))
        //   .format("HH:mm:ss"),
        projectName: item.projectName,
        task: item.task,
        managerTask: item.managerTask,
        sessionOne: item.sessionOne,
        sessionMinute: item.sessionMinute,
        // sessionTwo: item.sessionTwo,
        // others: item.others,
        // comments: item.comments,
        // total: item.total,
      })),
    [report]
  );
  // Team List
  const list = [
    "CV",
    "NLP",
    "CM",
  ];


  const [popperOpen, setPopperOpen] = useState(false);

  const handlePopperToggle = () => {
    setPopperOpen((prev) => !prev);
  };

  const handlePopperClose = () => {
    setPopperOpen(false);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <MDButton
          variant="gradient"
          color="success"
          startIcon={<AddCircleOutlineIcon />}
          onClick={openDrawer}
          style={{
            display: "flex",
            justifyContent: "center",
            // padding: "6px 12px", // Adjusted padding
            fontSize: "0.7rem", // Adjusted font size
            borderRadius: "10px",
            textAlign: "center",
            minHeight: "10px", // Adjust the height as needed
            minWidth: "120px", // Adjust the width as needed
          }}
        >
          Create Task
        </MDButton>
      </div>
      <Drawer anchor="right" PaperProps={{ style: { width: 712, backgroundColor: "#fff", color: "rgba(0, 0, 0, 0.87)", boxShadow: "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)", overflowY: "auto", display: "flex", flexDirection: "column", height: "100%", flex: "1 0 auto", zIndex: 1200, WebkitOverflowScrolling: "touch", position: "fixed", top: 0, outline: 0, margin: "0", border: "none", borderRadius: '0', padding: "23px" } }} open={drawerOpen} onClose={closeDrawer}>
        <MDBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2, // Adjusted margin-bottom
          }}
        >
          <Typography variant="h6">New Task</Typography>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 0 }} // Positioned to the top right corner
            onClick={closeDrawer}
          >
            <CloseIcon />
          </IconButton>
        </MDBox>

        <MDBox pb={5} component="form" role="form" onSubmit={submit}>


          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="project-name">Select Project Name</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              id="project-name"
              options={projectNames}
              value={value.projectName}
              onChange={(event, newValue) => {
                setValue({
                  ...value,
                  projectName: newValue,
                });
              }}

              renderInput={(params) => (
                <TextField {...params} />
              )}
            />
          </MDBox>
          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="department">Department</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              disablePortal
              id="combo-box-demo"
              options={list}
              value={
                value.projectName === "Not assigned-CV"
                  ? "CV"
                  : value.projectName === "Not assigned-NLP"
                    ? "NLP"
                    : value.team
              }
              onChange={(event, newValue) => {
                setValue({
                  ...value,
                  team: newValue,
                });
              }}

              renderInput={(params) => <TextField {...params} />}
            />
          </MDBox>
          <MDBox sx={{ width: 250, p: 2 }}>

            <InputLabel htmlFor="task">Task</InputLabel>
            <Autocomplete
              disablePortal
              id="task"
              name="createTask"
              options={(Array.isArray(taskList) ? taskList : []).map((task) => task.createTask)}
              onChange={handleTaskChange}
              sx={{ width: 626, mt: 1 }}
              renderInput={(params) => <TextField {...params} />}
            />



          </MDBox>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >

            <InputLabel sx={{ mt: 1, ml: 2 }} htmlFor="manager">Manager</InputLabel>
            <InputLabel sx={{ mt: 1, mr: 37 }} htmlFor="date">Date</InputLabel>
          </MDBox>
          <MDBox sx={{ p: 1, ml: 1 }}
            style={{
              display: "flex",
            }}
          >
            <Autocomplete
              fullWidth
              id="manager"
              options={managers}
              value={value.managerTask}
              onChange={(event, newValue) => {
                setValue({
                  ...value,
                  managerTask: newValue,
                });
              }}
              sx={{ width: 305 }}

              renderInput={(params) => <TextField {...params} />}
            />


            <TextField
              sx={{ width: 305, ml: 2 }}
              style={{
                display: "flex",
              }}
              id="date"
              variant="outlined"
              fullWidth
              type="date"
              name="dateTask"
              value={value.dateTask}
              onChange={handleInputchange}
            />


          </MDBox>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >

            <InputLabel sx={{ mt: 1, ml: 2 }} htmlFor="hour">Daily Log</InputLabel>
            <InputLabel sx={{ mt: 1, mr: 34.5 }} htmlFor="minutes">Minutes</InputLabel>
          </MDBox>
          <MDBox sx={{ width: 250, p: 2 }}>

            <TextField
              sx={{ width: 305 }}
              select
              fullWidth
              id="hour"
              name="sessionOne"
              value={value.sessionOne}
              onChange={handleInputchange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Time</option>
              <option value="1hour">1 Hour</option>
              <option value="2hours">2 Hours</option>
              <option value="3hours">3 Hours</option>
              <option value="4hours">4 Hours</option>
              <option value="5hours">5 Hours</option>
              <option value="6hours">6 Hours</option>
              <option value="7hours">7 Hours</option>
              <option value="8hours">8 Hours</option>
            </TextField>
            <TextField
              sx={{ width: 305, ml: 2 }}
              select
              fullWidth
              id="minutes"
              name="sessionMinute"
              value={value.sessionMinute}
              onChange={handleInputchange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Time</option>
              <option value="15minutes">15 minutes</option>
              <option value="30minutes">30 minutes</option>
              <option value="45minutes">45 minutes</option>
              <option value="60minutes">60 minutes</option>
            </TextField>
          </MDBox>
          <MDBox
            pt={3}
            px={2}
            display="flex"
            justifyContent="end"
            alignItems="center"
          >
            <MDButton type="submit" color="success">
              Save
            </MDButton>
          </MDBox>
        </MDBox>


      </Drawer>
      <Grid item xs={12} mt={1} mb={5}>
        {/* <Card> */}
        <Grid item xs={12} mt={4} mb={1}>
          <Card>
            <Box>
              <Popper
                open={popperOpen}
                // anchorEl={/* Provide the reference to the element that triggers the popper */}
                role={undefined}
                transition
                disablePortal
                style={{
                  zIndex: 9999,
                  position: "absolute",
                  top: "131px",
                  left: "0px",

                }}
              >
                {({ TransitionProps, placement }) => (
                  <ClickAwayListener onClickAway={handlePopperClose}>
                    <Paper>
                      {/* <DialogTitle sx={{ textAlign: 'center' }}>Your Popper Title</DialogTitle> */}
                      <DialogContent>
                        <MDBox
                          component="form"
                          role="form"
                          onSubmit={handleSubmit}
                          className="filter-popup"
                          sx={{ display: "flex", padding: "0px" }}
                        >
                          <MDBox
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              marginRight: 2,
                            }}
                          >
                            <MDTypography
                              variant="h6"
                              fontWeight="medium"
                              sx={{ fontSize: '15px' }}
                            >
                              Start Date
                            </MDTypography>
                            <MDInput
                              type="date"
                              name="startDate"
                              size="small"
                              sx={{ width: "100%" }}
                              value={values.startDate}
                              onChange={handleInputChange}
                            />
                          </MDBox>
                          <MDBox
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              marginRight: 2,
                            }}
                          >
                            <MDTypography
                              variant="h6"
                              // fontWeight="medium"
                              size="small"
                            >
                              End Date
                            </MDTypography>
                            <MDInput
                              id="movie-customized-option-demo"
                              type="date"
                              name="endDate"
                              size="small"
                              sx={{ width: "100%", border: 'none !important' }}
                              value={values.endDate}
                              onChange={handleInputChange}
                            />
                          </MDBox>
                          <MDBox
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              marginRight: 2,
                            }}
                          >
                            <MDTypography variant="h6" fontWeight="medium">
                              Team
                            </MDTypography>
                            <Autocomplete
                              options={list}
                              onChange={handleTeamChange}
                              id="movie-customized-option-demo"
                              disableCloseOnSelect
                              sx={{ width: "100%" }}
                              PopperComponent={(props) => (
                                <Popper {...props} style={{ zIndex: 99999, position: 'relative' }}>
                                  {props.children}
                                </Popper>
                              )}
                              renderInput={(params) => (
                                <TextField {...params} variant="standard" />
                              )}
                            />
                          </MDBox>
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            pt={3}
                          >
                            <MDButton
                              variant="gradient"
                              size="small"
                              color="info"
                              type="submit"
                            >
                              Search
                            </MDButton>
                          </Box>
                        </MDBox>
                      </DialogContent>
                    </Paper>
                  </ClickAwayListener>
                )}
              </Popper>
            </Box>
          </Card>
        </Grid>
        {/* </Card> */}
        {/* {show ? ( */}
        <MDBox pt={4}>
          <Grid item xs={12}>
            <Card>
              {/* <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Reports Table
                  </MDTypography>
                </MDBox> */}
              <MDBox pt={0}>
                <Box sx={{ height: 500, width: "100%", display: "flex", borderRadius: 20 }}>
                  <DataGrid
                    rows={report.length === 0 ? initialData : rows} // Use initialData when report is empty
                    columns={report.length === 0 ? initialDataColumns : columns} // Use initialDataColumns when report is empty
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    getRowId={(row) => row._id}
                    disableSelectionOnClick
                    components={{
                      Toolbar: () => (
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex", alignItems: "center", marginLeft: "10px", }}>
                            <FilterListIcon
                              className="team-filter-icon"
                              style={{
                                cursor: "pointer",
                                color: "#1a73e8",
                                fontSize: "20px",
                              }}
                              onClick={handlePopperToggle}
                              aria-label="Team Filter"
                            />
                            <MDTypography
                              variant="h6"
                              onClick={handlePopperToggle}
                              style={{
                                color: "#1a73e8",
                                cursor: "pointer",
                                fontSize: "12.1px",

                              }}
                            >
                              DATE FILTER
                            </MDTypography>
                          </div>

                          <GridToolbar />
                          <div
                            style={{
                              display: "flex",
                              marginLeft: "auto",
                              alignItems: "center",
                            }}
                          >
                            {/* <MDButton
                            className="team-report-btn"
                            variant="outlined"
                            color="error"
                            size="small"
                            style={{ marginRight: "13px" }}
                            onClick={allReport}
                          >
                            &nbsp;All Report
                          </MDButton> */}
                          </div>
                        </div>
                      ),
                    }}


                  />
                </Box>
              </MDBox>
            </Card>
          </Grid>
        </MDBox>
        {/* ) : null} */}
      </Grid>
      <Footer />
      <ToastContainer />
    </DashboardLayout>

  );
}

export default Report;
