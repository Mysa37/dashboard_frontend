import React, { useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Card,
  TextField,
  MenuItem,
  Button,
  Grid
} from '@mui/material';

const AddChart = () => {
  const [title, setTitle] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [labels, setLabels] = useState('');
  const [data, setData] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newChart = {
        title,
        chartType,
        labels: labels.split(',').map(l => l.trim()),
        data: data.split(',').map(d => parseFloat(d.trim()))
      };

      await axios.post('http://localhost:5003/api/data', newChart);
      alert('✅ Chart added successfully!');
      setTitle('');
      setChartType('bar');
      setLabels('');
      setData('');
    } catch (error) {
      console.error('Error adding chart:', error);
      alert('❌ Failed to add chart');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <Typography variant="h5" gutterBottom>
        ➕ Add New Chart
      </Typography>
      <Card style={{ padding: 20, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chart Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Chart Type"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <MenuItem value="bar">Bar</MenuItem>
                <MenuItem value="line">Line</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Labels (comma-separated)"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data (comma-separated)"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Chart
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </div>
  );
};

export default AddChart;
