import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar
} from 'react-chartjs-2';
import {
  Card,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import CountUp from 'react-countup';
import io from 'socket.io-client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const socket = io('http://localhost:5003');

const Dashboard = () => {
  const [charts, setCharts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5003/api/data')
      .then(res => {
        setCharts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching data:', err);
        setLoading(false);
      });

    socket.on('dataUpdated', (newData) => {
      setCharts(newData);
    });

    return () => socket.off('dataUpdated');
  }, []);

  const filteredCharts = charts.filter(chart =>
    filter === 'all' ? true : chart.chartType === filter
  );

  return (
    <div style={{
      padding: '30px',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      <Typography variant="h4" gutterBottom style={{ color: '#248AFD', fontWeight: 'bold' }}>
        📊 Enterprise Analytics Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} style={{ marginBottom: '40px' }}>
        {[{
          label: "Today's Users", value: 2300, bg: '#248AFD'
        }, {
          label: 'Revenue', value: 34000, prefix: '$', bg: '#F5A623'
        }, {
          label: 'Bookings', value: 281, bg: '#FFC100'
        }, {
          label: 'Followers', value: 91, prefix: '+', bg: '#71C02B'
        }].map((kpi, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card style={{
              padding: '20px',
              background: kpi.bg,
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              color: '#fff'
            }}>
              <Typography variant="subtitle1" gutterBottom>{kpi.label}</Typography>
              <Typography variant="h5">
                <CountUp
                  end={kpi.value}
                  duration={2}
                  separator=","
                  prefix={kpi.prefix || ''}
                />
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter Dropdown */}
      <FormControl style={{ minWidth: 200, marginBottom: 30 }}>
        <InputLabel id="filter-label">Filter by Chart Type</InputLabel>
        <Select
          labelId="filter-label"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="bar">Bar Charts</MenuItem>
          <MenuItem value="line">Line Charts</MenuItem>
          <MenuItem value="pie">Pie Charts</MenuItem>
          <MenuItem value="doughnut">Doughnut Charts</MenuItem>
          <MenuItem value="radar">Radar Charts</MenuItem>
        </Select>
      </FormControl>

      {/* Chart Section */}
      {loading ? (
        <p>⏳ Loading charts...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
          {filteredCharts.map((chart, index) => {
            const data = {
              labels: chart.labels,
              datasets: [{
                label: chart.title,
                data: chart.data,
                backgroundColor: [
                  '#42a5f5',
                  '#66bb6a',
                  '#ffa726',
                  '#ab47bc',
                  '#ef5350',
                  '#29b6f6',
                  '#ffee58'
                ],
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 1,
              }]
            };

            const options = {
              responsive: true,
              plugins: {
                legend: { display: true },
                title: { display: true, text: chart.title }
              },
              scales: chart.chartType === 'radar' || chart.chartType === 'pie' || chart.chartType === 'doughnut'
                ? {}
                : {
                    x: {
                      grid: { color: '#eee' },
                      ticks: { color: '#333' }
                    },
                    y: {
                      grid: { color: '#eee' },
                      ticks: { color: '#333' }
                    }
                  }
            };

            const renderChart = () => {
              switch (chart.chartType) {
                case 'bar': return <Bar data={data} options={options} />;
                case 'line': return <Line data={data} options={options} />;
                case 'pie': return <Pie data={data} options={options} />;
                case 'doughnut': return <Doughnut data={data} options={options} />;
                case 'radar': return <Radar data={data} options={options} />;
                default: return <p>Unsupported chart type</p>;
              }
            };

            return (
              <Card key={index} style={{
                width: '500px',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" gutterBottom>{chart.title}</Typography>
                {renderChart()}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
