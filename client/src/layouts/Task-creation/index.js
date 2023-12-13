import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { DataGrid, GridToolbar, GridPagination } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function TaskCreation() {
  const [task, setTask] = useState({
    createTask: "",
  });

  const [addManager, setAddManager] = useState({
    createManager: "",
  });

  const [addTeam, setAddTeam] = useState({
    createTeam: "",
  });

  const [teamList, setTeamList] = useState([]);
  const handleTeamChange = (event, value) => setTeamList(value);

  const [managers, setManagers] = useState([]);
  const handleManagerChange = (event, value) => setManagers(value);
  const [data, setData] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleInputChangeTwo = (e) => {
    const { name, value } = e.target;
    setAddManager({
      ...addManager,
      [name]: value,
    });
  };

  const handleInputChangeThree = (e) => {
    const { name, value } = e.target;
    setAddTeam({
      ...addTeam,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const taskData = {
      createTask: task.createTask,
    };

    axios.post("/create/new", taskData)
      .then((res) => {
        toast.success(res.data);
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmitTwo = () => {
    const managerData = {
      createManager: addManager.createManager,
    };

    axios.post("/create/add-manager/new", managerData)
      .then((res) => {
        toast.success(res.data);
        // Fetch team data after adding a manager
        axios.get("/create/fetch/addteam-data").then((response) => {
          setTeamList(response.data);
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmitThree = () => {
    const teamData = {
      createTeam: addTeam.createTeam,
    };

    axios.post("/create/add-team/new", teamData)
      .then((res) => {
        toast.success(res.data);
        // Fetch manager data after adding a team
        axios.get("/create/fetch/manager-data").then((response) => {
          setManagers(response.data);
        });
      })
      .catch((err) => toast.error(err));
  };
  const [taskData, setTaskData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [managerData, setManagerData] = useState([]);
  // Fetch team and manager data
  const fetchData = () => {
        // Fetch team data
        axios.get("/create/fetch/task-data").then((response) => {
          setTaskData(response.data);
        });
    
    // Fetch team data
    axios.get("/create/fetch/addteam-data").then((response) => {
      setTeamData(response.data);
    });

    // Fetch manager data
    axios.get("/create/fetch/manager-data").then((response) => {
      setManagerData(response.data);
    });
  };

  // Update data immediately after submitting
  const updateData = () => {
    fetchData();
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  const handleDeleteTask = (id) => {
    axios
      .delete("/create/delete/task/" + id)
      .then((res) => {
        toast.warn(res.data);
  
        // Log the state before and after updating
        console.log("Before deletion:", data);
        setData((prevData) => prevData.filter((team) => team._id !== id));
        console.log("After deletion:", data);
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteManager = (id) => {
    axios
      .delete("/create/delete/manager/" + id)
      .then((res) => {
        toast.warn(res.data);
  
        // Log the state before and after updating
        console.log("Before deletion:", data);
        setData((prevData) => prevData.filter((team) => team._id !== id));
        console.log("After deletion:", data);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteTeam = (id) => {
    axios
      .delete("/create/delete/team/" + id)
      .then((res) => {
        toast.warn(res.data);
  
        // Log the state before and after updating
        console.log("Before deletion:", data);
        setData((prevData) => prevData.filter((team) => team._id !== id));
        console.log("After deletion:", data);
      })
      .catch((err) => console.log(err));
  };
  


  return (
    <DashboardLayout>
    <DashboardNavbar />
    <Grid container justifyContent="center" alignItems="center" style={{ height: "80vh" }} spacing={2}>
      <Grid item>
        <Card>
          <Box p={2}>
            <TextField label="Task Name" name="createTask" value={task.createTask} onChange={handleInputChange} variant="outlined" fullWidth />
            <MDButton variant="contained" color="primary" onClick={() => { handleSubmit(); updateData(); }}>
              Submit
            </MDButton>
                {/* Display task data */}
                <MDTypography variant="h6">Task Data:</MDTypography>
            <ul>
  {taskData.map((task) => (
    <li key={task.id}>
      {task.createTask}
      <MDButton variant="contained" color="secondary" onClick={() => handleDeleteTask(task._id)}>
        Delete
      </MDButton>
    </li>
  ))}
</ul>
          </Box>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <Box p={2}>
            <TextField label="Manager Name" name="createManager" value={addManager.createManager} onChange={handleInputChangeTwo} variant="outlined" fullWidth />
            <MDButton variant="contained" color="primary" onClick={() => { handleSubmitTwo(); updateData(); }}>
              Submit
            </MDButton>
            {/* Display manager data */}
            <MDTypography variant="h6">Manager Data:</MDTypography>
            <ul>
  {managerData.map((manager) => (
    <li key={manager.id}>
      {manager.createManager}
      <MDButton variant="contained" color="secondary" onClick={() => handleDeleteManager(manager._id)}>
        Delete
      </MDButton>
    </li>
  ))}
</ul>
          </Box>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <Box p={2}>
            <TextField label="Team Name" name="createTeam" value={addTeam.createTeam} onChange={handleInputChangeThree} variant="outlined" fullWidth />
            <MDButton variant="contained" color="primary" onClick={() => { handleSubmitThree(); updateData(); }}>
              Submit
            </MDButton>
            {/* Display team data */}
            <MDTypography variant="h6">Team Data:</MDTypography>
<ul>
  {teamData.map((team) => (
    <li key={team.id}>
      {team.createTeam}
      <MDButton variant="contained" color="secondary" onClick={() => handleDeleteTeam(team._id)}>
        Delete
      </MDButton>
    </li>
  ))}
</ul>
          </Box>
        </Card>
      </Grid>
    </Grid>
    <Footer />
    <ToastContainer />
  </DashboardLayout>
  );
}

export default TaskCreation;
