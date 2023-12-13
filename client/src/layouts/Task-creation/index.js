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
import axios from "axios";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";

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
      const [addStatus, setAddStatus] = useState({
        createStatus: "",
      });
      const handleInputChange = (e) => {
        const { name, value } = e.target;
     
        setTask({
          ...task,
          [name]: value,
          // managerTeam: managerTeamList,
          // status1: status,
        });
      };
      const handleInputChangeTwo = (e) => {
        const { name, value } = e.target;
     
        setAddManager({
          ...addManager,
          [name]: value,
          // managerTeam: managerTeamList,
          // status1: status,
        });
      };
      const handleInputChangeThree = (e) => {
        const { name, value } = e.target;
     
        setAddTeam({
          ...addTeam,
          [name]: value,
          // managerTeam: managerTeamList,
          // status1: status,
        });
      };
      const handleInputChangeFour = (e) => {
        const { name, value } = e.target;
     
        setAddStatus({
          ...addStatus,
          [name]: value,
          // managerTeam: managerTeamList,
          // status1: status,
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
    // Handle form submission logic here
  };
  const handleSubmitTwo = () => {
    const managerData = {
      createManager: addManager.createManager,
      };
      axios.post("/create/add-manager/new", managerData)
      .then((res) => {
      toast.success(res.data);
      })
      .catch((err) => toast.error(err));
    // Handle form submission logic here
  };
  const handleSubmitThree = () => {
    const teamData = {
        createTeam: addTeam.createTeam,
      };
      axios.post("/create/add-team/new", teamData)
      .then((res) => {
      toast.success(res.data);
      })
      .catch((err) => toast.error(err));
    // Handle form submission logic here
  };
  const handleSubmitFour = () => {
    const statusData = {
        createStatus: addStatus.createStatus,
      };
      axios.post("/create/add-status/new", statusData)
      .then((res) => {
      toast.success(res.data);
      })
      .catch((err) => toast.error(err));
    // Handle form submission logic here
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container justifyContent="center" alignItems="center" style={{ height: "80vh" }} spacing={2}>
  <Grid item>
    <Card>
      <Box p={2}>
        {/* Your input box */}
        <TextField label="Task Name" name="createTask" value={task.createTask} onChange={handleInputChange} variant="outlined" fullWidth />
        {/* Submit button */}
        <MDButton variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </MDButton>
      </Box>
    </Card>
  </Grid>
  <Grid item>
    <Card>
      <Box p={2}>
        {/* Your input box */}
        <TextField label="Manager Name" name="createManager" value={addManager.createManager} onChange={handleInputChangeTwo} variant="outlined" fullWidth />
        {/* Submit button */}
        <MDButton variant="contained" color="primary" onClick={handleSubmitTwo}>
          Submit
        </MDButton>
      </Box>
    </Card>
  </Grid>
  <Grid item>
    <Card>
      <Box p={2}>
        {/* Your input box */}
        <TextField label="Team Name" name="createTeam" value={addTeam.createTeam} onChange={handleInputChangeThree} variant="outlined" fullWidth />
        {/* Submit button */}
        <MDButton variant="contained" color="primary" onClick={handleSubmitThree}>
          Submit
        </MDButton>
      </Box>
    </Card>
  </Grid>
  <Grid item>
    <Card>
      <Box p={2}>
        {/* Your input box */}
        <TextField label="Status Name" name="createStatus" value={addStatus.createStatus} onChange={handleInputChangeFour} variant="outlined" fullWidth />
        {/* Submit button */}
        <MDButton variant="contained" color="primary" onClick={handleSubmitFour}>
          Submit
        </MDButton>
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
