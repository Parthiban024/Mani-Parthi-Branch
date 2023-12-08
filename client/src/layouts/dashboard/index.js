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


  return (
    <div>
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
            minWidth: "120px",
           // Adjust the width as needed
          }}
        >
          Add Employee
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

        <MDBox pb={5} component="form" role="form" >

          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="hour">Daily Log</InputLabel>

            <TextField
              sx={{ width: 305, mt: 1 }}
              select
              fullWidth
              id="hour"
              name="sessionOne"
              // value={value.sessionOne}
              // onChange={handleInputchange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Hours</option>
              <option value="1hour">1 Hour</option>
              <option value="2hour">2 Hour</option>
              <option value="3hour">3 Hour</option>
              <option value="4hour">4 Hour</option>
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
      </DashboardLayout>
    </div>
  );
};

export default UserDataUpload;
