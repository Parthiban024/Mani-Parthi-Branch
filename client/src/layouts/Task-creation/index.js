import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { ToastContainer, toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const TaskCreation = () => {
  const [task, setTask] = useState({
    createTask: "",
  });

  const [addManager, setAddManager] = useState({
    createManager: "",
  });

  const [addTeam, setAddTeam] = useState({
    createTeam: "",
  });

  const [taskData, setTaskData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [managerData, setManagerData] = useState([]);

  const fetchData = () => {
    axios.get("/create/fetch/task-data").then((response) => {
      setTaskData(response.data);
    });

    axios.get("/create/fetch/addteam-data").then((response) => {
      setTeamData(response.data);
    });

    axios.get("/create/fetch/manager-data").then((response) => {
      setManagerData(response.data);
    });
  };

  const updateData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

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

    axios
      .post("/create/new", taskData)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setTask({
          createTask: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmitTwo = () => {
    const managerData = {
      createManager: addManager.createManager,
    };

    axios
      .post("/create/add-manager/new", managerData)
      .then((res) => {
        toast.success(res.data);
        axios.get("/create/fetch/addteam-data").then((response) => {
          setTeamData(response.data);
        });
        updateData();
        setAddManager({
          createManager: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmitThree = () => {
    const teamData = {
      createTeam: addTeam.createTeam,
    };

    axios
      .post("/create/add-team/new", teamData)
      .then((res) => {
        toast.success(res.data);
        axios.get("/create/fetch/manager-data").then((response) => {
          setManagerData(response.data);
        });
        updateData();
        setAddTeam({
          createTeam: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleDeleteTask = (id) => {
    axios
      .delete("/create/delete/task/" + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  
  const handleDeleteManager = (id) => {
    axios
      .delete("/create/delete/manager/" + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  
  const handleDeleteTeam = (id) => {
    axios
      .delete("/create/delete/team/" + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "80vh" }}
        spacing={4}
      >
        <Grid item>
          <Card>
            <Box p={2}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Add Task"
                  name="createTask"
                  value={task.createTask}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  style={{ marginRight: '10px' }}
                />
                <IconButton
                  style={{ background: "#4caf50", borderRadius: "5px" }}
                  onClick={() => {
                    handleSubmit();
                    updateData();
                  }}
                >
                  <AddIcon style={{ color: "white" }} />
                </IconButton>
              </div>
              {/* <MDTypography variant="h6">Task Data:</MDTypography> */}
              <ul style={{ listStyleType: "none", paddingTop: 15 }}>
                {taskData.map((task) => (
                  <li
                    key={task.id}
                    style={{
                      background: "#f0f0f0",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.createTask}
                    <span
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red", // Set color to red
                      }}
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      &#x1F5D1;
                    </span>
                  </li>
                ))}
              </ul>
            </Box>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <Box p={2}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                        label="Add Manager"
                        name="createManager"
                        value={addManager.createManager}
                        onChange={handleInputChangeTwo}
                        variant="outlined"
                        fullWidth
                  style={{ marginRight: '10px' }}
                />
                <IconButton
                  style={{ background: "#4caf50", borderRadius: "5px" }}
                  onClick={() => {
                    handleSubmitTwo();
                    updateData();
                  }}
                >
                  <AddIcon style={{ color: "white" }} />
                </IconButton>
              </div>
              {/* <MDTypography variant="h6">Manager Data:</MDTypography> */}
              <ul style={{ listStyleType: "none", paddingTop: 15 }}>
                {managerData.map((manager) => (
                  <li
                    key={manager.id}
                    style={{
                      background: "#f0f0f0",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {manager.createManager}
                    <span
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red", // Set color to red
                      }}
                      onClick={() => handleDeleteManager(manager._id)}
                    >
                      &#x1F5D1;
                    </span>
                  </li>
                ))}
              </ul>
            </Box>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <Box p={2}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                   label="Add Team"
                   name="createTeam"
                   value={addTeam.createTeam}
                   onChange={handleInputChangeThree}
                   variant="outlined"
                   fullWidth
                   style={{ marginRight: '10px' }}
                />
                <IconButton
                  style={{ background: "#4caf50", borderRadius: "5px" }}
                  onClick={() => {
                    handleSubmitThree();
                    updateData();
                  }}
                >
                  <AddIcon style={{ color: "white" }} />
                </IconButton>
              </div>
              {/* <MDTypography variant="h6">Team Data:</MDTypography> */}
              <ul style={{ listStyleType: "none", paddingTop: 15 }}>
                {teamData.map((team) => (
                  <li
                    key={team.id}
                    style={{
                      background: "#f0f0f0",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {team.createTeam}
                    <span
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red", // Set color to red
                      }}
                      onClick={() => handleDeleteTeam(team._id)}
                    >
                      &#x1F5D1;
                    </span>
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
};

export default TaskCreation;
