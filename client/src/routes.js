// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Resetpwd from "layouts/authentication/resetpwd";
import Forgotpwd from "layouts/authentication/forgotpwd";
import UserReport from "layouts/UserReport";
import AdminReport from "layouts/AdminReport";
import BillingReport from "layouts/Billing-report";
import BillingTable from "layouts/Billing-Table";
 import EmployeeAtt from "./layouts/Emp-Attendance";
// import CreateTeam from "layouts/create-team";
// import Edit from 'layouts/Billing-report/Edit'
import Attendance from "layouts/Attendance";
import Employee from "layouts/employeeReport"
// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "Dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    role: "open",
  },
  {
    type: "collapse",
    name: "Attendance",
    key: "Attendance",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/attendance",
    component: <Attendance />,
    role: "analyst",
  },
  {
    type: "collapse",
    name: "UserTask",
    key: "user-task",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/user-task",
    component: <UserReport />,
    role: "analyst",
  },
  {
    type: "collapse",
    name: "Team Report",
    key: "team-report",
    icon: <Icon fontSize="small">switch_account</Icon>,
    route: "/team-report",
    component: <AdminReport />,
    role: "admin",
  },
  // {
  //   type: "collapse",
  //   name: "Attendance",
  //   key: "attendance",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/attendance",
  //   component: <Attendance />,
  //   role: "analyst",
  // },
  {
    type: "collapse",
    name: "Employee",
    key: "employee",
    icon: <Icon fontSize="small">switch_account</Icon>,
    route: "/employee",
    component: <Employee />,
    role: "admin",
  },
  {
    type: "collapse",
    name: "Employee Attendance",
    key: "employee-attendance",
    icon: <Icon fontSize="small">create_new_folder</Icon>,
    route: "/employee-attendance",
    component: <EmployeeAtt/>,
    role: "admin",
  },
  // {
  //   type: "collapse",
  //   name: "BillingReport",
  //   key: "billing-report",
  //   icon: <Icon fontSize="small">trending_up</Icon>,
  //   route: "/billing-report",
  //   component: <BillingReport />,
  //   role: "admin",
  // },
  // {
  //   key:"editReport",
  //   route: "/billing-report/edit",
  //   component: <Edit />,
  //   role: "admin",
  // },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <Icon fontSize="small">trending_up</Icon>,
    route: "/projects",
    component: <BillingTable />,
    role: "admin",
  },
  // {
  //   type: "collapse",
  //   name: "Create Team",
  //   key: "create-team",
  //   icon: <Icon fontSize="small">groups</Icon>,
  //   route: "/create-team",
  //   component: <CreateTeam />,
  //   role: "admin",
  // },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Resetpwd",
    key: "resetpwd",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/reset/:token",
    component: <Resetpwd />,
  },
  {
    type: "collapse",
    name: "Forgotpwd",
    key: "forgotpwd",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/forget",
    component: <Forgotpwd />,
  },
];

export default routes;
