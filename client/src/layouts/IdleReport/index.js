import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, Grid, TextField, Button } from '@mui/material';
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
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [tableData, setTableData] = useState([]); // New state for table data
  const [showTable, setShowTable] = useState(false); // Flag to control table visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/analyst/fetch/taskwise', {
          params: {
            sDate: startDate.toISOString().split('T')[0],
            eDate: endDate.toISOString().split('T')[0],
          },
        });

        const data = response.data;

        const projectNames = [...new Set(data.map((item) => item._id.projectName))];
        const taskLabels = [...new Set(data.map((item) => item._id.task))];

        const datasets = projectNames.map((projectName) => {
          const counts = taskLabels.map((task) => {
            const matchingItem = data.find(
              (item) => item._id.projectName === projectName && item._id.task === task
            );
            return matchingItem ? matchingItem.count : 0;
          });

          return {
            label: projectName,
            data: counts,
            backgroundColor: getRandomColor(),
          };
        });

        setChartData({
          labels: taskLabels,
          datasets: datasets,
        });

        // Prepare table data
        const tableData = data.map((item, index) => ({
          id: index + 1,
          projectName: item._id.projectName,
          task: item._id.task,
          count: item.count,
        }));

        setTableData(tableData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

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
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(event) => setStartDate(new Date(event.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={endDate.toISOString().split('T')[0]}
                    onChange={(event) => setEndDate(new Date(event.target.value))}
                    fullWidth
                  />
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
                      { field: 'projectName', headerName: 'Project Name', width: 150,flex: 1 },
                      { field: 'task', headerName: 'Task', width: 200,flex: 1 },
                      { field: 'count', headerName: 'Members Count', width: 150,flex: 1 },
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
