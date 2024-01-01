import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDButton from "components/MDButton";
import * as XLSX from 'xlsx';

const TaskWiseBarChart = () => {
  const getCurrentMonthStartDate = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  };

  const getCurrentMonthEndDate = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  };

  const [startDate, setStartDate] = useState(getCurrentMonthStartDate());
  const [endDate, setEndDate] = useState(getCurrentMonthEndDate());
  const [projectNames, setProjectNames] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchProjectNames = async () => {
      try {
        const response = await axios.get('/analyst/projectNames');
        const projectNames = response.data;
        setProjectNames(projectNames);
      } catch (error) {
        console.error('Error fetching project names:', error);
      }
    };

    fetchProjectNames();
  }, []);
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedProject) {
          // If no project is selected, clear the chart data
          setChartData({
            labels: [],
            datasets: [],
          });
          setTableData([]);
          return;
        }

        const response = await axios.get('/analyst/fetch/taskwise', {
          params: {
            sDate: startDate.toISOString().split('T')[0],
            eDate: endDate.toISOString().split('T')[0],
            projectName: selectedProject,
          },
        });

        const data = response.data;

        const taskLabels = [...new Set(data.map((item) => item._id.task))];
        const dateLabels = [...new Set(data.map((item) => formatDate(item._id.dateTask)))]; // Assuming you have a function formatDate to format dates

        setXAxisLabels(dateLabels);

        const datasets = [
          {
            label: selectedProject,
            data: taskLabels.map((task) => {
              const matchingItem = data.find((item) => item._id.task === task);
              return matchingItem ? matchingItem.count : 0;
            }),
            backgroundColor: getRandomColor(),
          },
        ];

        setChartData({
          labels: dateLabels,
          datasets: datasets,
        });

        // Prepare table data
        const tableData = taskLabels.map((task, index) => ({
          id: index + 1,
          task: task,
          count: datasets[0].data[index],
        }));

        setTableData(tableData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate, selectedProject]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const exportChartDataToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [['Task', ...chartData.labels], ...chartData.datasets.map((dataset) => [dataset.label, ...dataset.data])];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'TaskWiseUserCount');
    XLSX.writeFile(wb, 'TaskWiseUserCount.xlsx');
  };

  const handleViewTable = () => {
    setShowTable(!showTable);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader>
              <h2>Task-wise User Count</h2>
            </CardHeader>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(event) => setStartDate(new Date(event.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={endDate.toISOString().split('T')[0]}
                    onChange={(event) => setEndDate(new Date(event.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Project Name</InputLabel>
                    <Select
                      value={selectedProject}
                      onChange={(event) => setSelectedProject(event.target.value)}
                    >
                      {projectNames.map((project) => (
                        <MenuItem key={project} value={project}>
                          {project}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                marginTop: "20px"
              }}>
                <MDButton variant="contained" color="primary" onClick={handleViewTable}>
                  {showTable ? 'Hide Table' : 'View in Table'}
                </MDButton>
                <MDButton variant="gradient" color="success" onClick={exportChartDataToExcel}>
                  Export
                </MDButton>
              </Grid>
              {chartData.labels.length > 0 && (
                <div style={{ height: '400px', overflowY: 'auto', marginTop: '20px' }}>
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { stacked: true },
                        y: { stacked: true },
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                      },
                    }}
                  />
                </div>
              )}
              {showTable && (
                <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
                  <DataGrid
                    rows={tableData}
                    columns={[
                      { field: 'id', headerName: 'ID', width: 30 },
                      { field: 'task', headerName: 'Task', width: 200, flex: 1 },
                      { field: 'count', headerName: 'Members Count', width: 150, flex: 1 },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default TaskWiseBarChart;
