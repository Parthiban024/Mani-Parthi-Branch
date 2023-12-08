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
import 'layouts/Billing-Table/table.css'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import 'layouts/Billing-Table/table.css'
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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
      sessionOne: ''
    }));
  };

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
      .then(() => toast.success("Successfully Data Submitted 👌"))
      .catch((err) => toast.error(`Try Again Followed Error Acquired: ${err}☹️`));

    // console.log(userData);
    closeDrawer()
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
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
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
      field: "date",
      headerName: "Date",
      // type: 'date',
      width: 130,
      editable: false,
      flex: 1,
    },
    {
      field: "projectName",
      headerName: "Project Name",
      // type: 'time',
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "task",
      headerName: "Task",
      // type: 'time',
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "managerTask",
      headerName: "Project Manager",
      // type: 'number',
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "sessionOne",
      headerName: "Hours",
      // type: 'number',
      width: 150,
      editable: false,
      flex: 1,
    },
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
          Add Task
        </MDButton>
      </div>
      <Drawer anchor="right" PaperProps={{ style: { width: 712 } }} open={drawerOpen} onClose={closeDrawer}>
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
              options={tasklist}
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
            <InputLabel sx={{ mt: 1, mr: 33 }} htmlFor="date">Date</InputLabel>
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

          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="hour">Daily Log</InputLabel>

         <TextField
  sx={{ width: 305, mt: 1 }}
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
  {[...Array(8)].map((_, hour) => (
    [0, 15, 30, 45].map((minute) => {
      const time = `${hour + 1} Hour ${minute} Minute`;
      const value = `${(hour + 1).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      return (
        <option key={value} value={value}>
          {time}
        </option>
      );
    })
  ))}
</TextField>

            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: 305, mt: 1}}>
        <TimePicker
        id="hour"
         name="sessionOne"
         value={value.sessionOne}
         onChange={handleInputchange}
          referenceDate={dayjs('2022-04-17')}
        />
        <Typography>
          Stored value: {values == null ? 'null' : values.format()}
        </Typography>
      </Stack>
    </LocalizationProvider> */}
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
        <Dialog
          open={filterDialogOpen}
          onClose={closeFilterDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ textAlign: 'left' }}>Your Dialog Title</DialogTitle>
          <DialogContent>
            <MDBox
              component="form"
              role="form"
              onSubmit={handleSubmit}
              className="filter-popup"
            >
              <Grid container spacing={3}>
                {/* Row 1: Start Date and End Date */}
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Start Date
                  </MDTypography>
                  <MDInput
                    type="date"
                    name="startDate"
                    sx={{ width: '100%' }}
                    value={values.startDate}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    End Date
                  </MDTypography>
                  <MDInput
                    type="date"
                    name="endDate"
                    sx={{ width: '100%' }}
                    value={values.endDate}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Row 2: Team and Name */}
                <Grid item xs={6}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Team
                  </MDTypography>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={list}
                    onChange={handleTeamChange}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>


                {/* Row 3: Search Button */}
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    pt={3}
                  >
                    <MDButton variant="gradient" size="small" color="success" type="submit">
                      Search
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      size="small"
                      color="warning"
                      onClick={handleCancel}
                      style={{ marginLeft: '10px' }}
                    >
                      Cancel
                    </MDButton>
                  </Box>
                </Grid>
              </Grid>
            </MDBox>
          </DialogContent>
          {/* <DialogActions>
    Add a close button or any other UI element to close the filter popup
    <IconButton onClick={closeFilterDialog}>
      <CloseIcon />
    </IconButton>
  </DialogActions> */}
        </Dialog>
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
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    components={{
                      Toolbar: () => (
                        <div style={{ display: 'flex' }}>
                          <GridToolbar />
                          {/* Custom filter icon with aria-label */}


                          <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }} >

                            <FilterListIcon
                              className="team-filter-icon"
                              // style={{ cursor: 'pointer', color: '#3a87ea', fontSize: '20px' }}
                              // onClick={openDrawer}
                              style={{ cursor: 'pointer', color: '#3a87ea', fontSize: '20px' }}
                              onClick={openFilterDialog}
                              aria-label="Team Filter"
                            />
                            <MDTypography variant="h6" onClick={openFilterDialog} style={{ color: '#3a87ea', cursor: 'pointer', fontSize: '12.1px', marginRight: '10px', }}>
                              TEAM FILTER
                            </MDTypography>

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
