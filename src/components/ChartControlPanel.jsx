// src/components/ChartControlPanel.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, MenuItem, Typography, Grid } from '@mui/material';

const ChartControlPanel = () => {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    chartType: 'bar',
    labels: '',
    data: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      data: formData.data.split(',').map(Number),
      labels: formData.labels.split(','),
    };
    try {
      await axios.post('http://localhost:5003/api/data', payload);
      alert('✅ Chart updated!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update chart.');
    }
  };

  return (
    <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px' }}>
      <Typography variant="h6" gutterBottom>🛠️ Admin Chart Control</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}><TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Value (display only)" name="value" value={formData.value} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={6}>
            <TextField select label="Chart Type" name="chartType" value={formData.chartType} onChange={handleChange} fullWidth>
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="line">Line</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}><TextField label="Labels (comma-separated)" name="labels" value={formData.labels} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={12}><TextField label="Data Points (comma-separated)" name="data" value={formData.data} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={12}><Button variant="contained" type="submit" color="primary">Submit</Button></Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ChartControlPanel;
