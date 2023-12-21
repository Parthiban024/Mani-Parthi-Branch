

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const LastLogin = () => {
  const [lastLogin, setLastLogin] = useState([]);

  useEffect(() => {
    const fetchLastLogins = async () => {
      try {
        // Replace '/api/auth/all-last-logins' with the correct endpoint from your backend
        const response = await axios.get('/api/auth/LastLogin');
        console.log('All Last Logins Data:', response.data);
        setLastLogin(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLastLogins();
  }, []);


  return (
    <DashboardLayout>
    <DashboardNavbar />
    <div>
      <h2>All Users Last Login Details</h2>
      <ul>
        {Array.isArray(lastLogin) && lastLogin.length > 0 ? (
          lastLogin.map((login) => (
            <li key={login._id}>
              User: {login.userId.name}, Email: {login.userId.email}, Login Time: {new Date(login.loginTime).toLocaleString()}
            </li>
          ))
        ) : (
          <li>No last login details available</li>
        )}
      </ul>
    </div>
   </DashboardLayout>
  );
};

export default LastLogin;
