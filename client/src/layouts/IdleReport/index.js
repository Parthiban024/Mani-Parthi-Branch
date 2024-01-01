import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, Grid, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDButton from 'components/MDButton';
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
  const [selectedProject, setSelectedProject] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [idleNonBillableCount, setIdleNonBillableCount] = useState(0);
  const [idleBillableCount, setIdleBillableCount] = useState(0);
  const [productionCount, setProductionCount] = useState(0);

  const [pieChartData, setPieChartData] = useState({
    labels: ['Idle - Non Billable', 'Idle - Billable', 'Production'],
    datasets: [
      {
        data: [idleNonBillableCount, idleBillableCount, productionCount],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedProject) {
          setChartData({
            labels: [],
            datasets: [],
          });
          setTableData([]);
          setIdleNonBillableCount(0);
          setIdleBillableCount(0);
          setProductionCount(0);
          setPieChartData({
            labels: ['Idle - Non Billable', 'Idle - Billable', 'Production'],
            datasets: [
              {
                data: [0, 0, 0],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          });
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
        const uniqueDates = [...new Set(data.map((item) => item._id.date))];
        const uniqueTasks = [...new Set(data.map((item) => item._id.task))];

        const datasets = uniqueTasks.map((task) => {
          const taskData = data.filter((item) => item._id.task === task);
          return {
            label: task,
            data: uniqueDates.map((date) => {
              const matchingItem = taskData.find((item) => item._id.date === date);
              return matchingItem ? matchingItem.count : 0;
            }),
            backgroundColor: getRandomColor(),
          };
        });

        let idleNonBillableCount = 0;
        let idleBillableCount = 0;
        let productionCount = 0;

        datasets.forEach((dataset) => {
          const task = dataset.label.toLowerCase();
          const count = dataset.data.reduce((sum, value) => sum + value, 0);

          if (task.includes('idle') && task.includes('non billable')) {
            idleNonBillableCount += count;
          } else if (task.includes('idle') && task.includes('billable')) {
            idleBillableCount += count;
          } else {
            productionCount += count;
          }
        });

        setIdleNonBillableCount(idleNonBillableCount);
        setIdleBillableCount(idleBillableCount);
        setProductionCount(productionCount);

        setChartData({
          labels: uniqueDates,
          datasets: datasets,
        });

        const tableData = uniqueTasks.map((task, index) => ({
          id: index + 1,
          task: task,
          ...datasets[index],
        }));

        setTableData(tableData);

        setPieChartData({
          labels: ['Idle - Non Billable', 'Idle - Billable', 'Production'],
          datasets: [
            {
              data: [idleNonBillableCount, idleBillableCount, productionCount],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate, selectedProject]);

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const exportChartDataToExcel = async () => {
    try {
      if (!selectedProject) {
        console.error('No project selected for export');
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

      if (data.length === 0) {
        console.error('No data available for export');
        return;
      }

      const wb = XLSX.utils.book_new();
      const uniqueDates = [...new Set(data.map((item) => item._id.date))];
      const uniqueTasks = [...new Set(data.map((item) => item._id.task))];
      const datasets = uniqueTasks.map((task) => {
        const taskData = data.filter((item) => item._id.task === task);
        return {
          label: task,
          data: uniqueDates.map((date) => {
            const matchingItem = taskData.find((item) => item._id.date === date);
            return matchingItem ? matchingItem.count : 0;
          }),
        };
      });

      const wsData = [['Task', ...uniqueDates]];

      datasets.forEach((dataset) => {
        const row = [dataset.label, ...dataset.data];
        wsData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, selectedProject);
      XLSX.writeFile(wb, 'TaskWiseUserCount.xlsx');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleViewTable = () => {
    setShowTable(!showTable);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <h2>Percentage Distribution</h2>
            </CardHeader>
            <CardContent>
              {pieChartData.labels.length > 0 && (
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <h3>Idle - Non Billable Count</h3>
                  <p>{idleNonBillableCount}</p>
                </Grid>
                <Grid item xs={12} md={4}>
                  <h3>Idle - Billable Count</h3>
                  <p>{idleBillableCount}</p>
                </Grid>
                <Grid item xs={12} md={4}>
                  <h3>Production Count</h3>
                  <p>{productionCount}</p>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
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
                    <Select value={selectedProject} onChange={handleProjectChange}>
                      {projectNames.map((project) => (
                        <MenuItem key={project} value={project}>
                          {project}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  minHeight: '10px',
                  minWidth: '120px',
                  marginTop: '20px',
                }}
              >
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
