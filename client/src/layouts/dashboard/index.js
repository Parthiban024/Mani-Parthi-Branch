import React, { useState, useEffect } from 'react';
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

// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import cartoon from "assets/images/cartoon.png";

const UserDataUpload = () => {


  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to handle opening the drawer
  const openDrawer = () => {
    setDrawerOpen(true);
  };


  // Function to handle closing the drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  }

  let greet;
  const date = new Date();
  const hours = date.getHours();
  const today = moment();

  const styles = {
    fontSize: 35,
  };

  if (hours < 12) {
    greet = "morning";
    styles.color = "#D90000";
  } else if (hours >= 12 && hours < 17) {
    greet = "afternoon";
    styles.color = "#04733F";
  } else if (hours >= 17 && hours < 20) {
    greet = "evening";
    styles.color = "#04756F";
  } else {
    greet = "night";
    styles.color = "#04756F";
  }

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />

      <Card lg={{ pb: "20px", height: "100%" }}>
      <MDBox pt={3} px={2} mb={8}>
        <MDBox
          display="flex"
          flexDirection="row"
          // flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <MDTypography variant="h2" fontWeight="bold" color="info" textTransform="capitalize">
            <div>Good {greet}</div>
          </MDTypography>
          <MDBox display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
            <MDBox color="text" mr={0.5} lineHeight={0}>
              <Icon color="info" fontSize="large">
                schedule
              </Icon>
            </MDBox>
            <MDTypography color="Warning" fontWeight="regular">
              <div> {today.format("LT")}</div>
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox
          pt={3}
          pb={2}
          px={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <MDBox mb={2}>
            <MDTypography variant="caption" color="success" fontWeight="bold">
              <h1>Welcome to Objectways Dashboard</h1>
            </MDTypography>
            {/* <MDTypography variant="caption" color="success" fontWeight="bold">
              <h2>Here whats happening in your account today</h2>
            </MDTypography> */}
            {/* <MDTypography component="a" href="#" type="button" color="info" fontWeight="medium">
            <h4> Whats New</h4>
          </MDTypography> */}
          </MDBox>
          <MDBox
            component="ul"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-evenly"
            p={0}
            m={0}
            sx={{ listStyle: "none" }}
          >
            <Grid container alignItems="center">
              <Grid item>
                <MDBox component="img" src={cartoon} alt="cartoon" width="100%" mt={1} />
              </Grid>
              <Grid item>
                {/* <MDBox component="img" src={cartoon} alt="cartoon" width="100%" mt={1} /> */}
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
      </DashboardLayout>
    </div>
  );
};

export default UserDataUpload;
