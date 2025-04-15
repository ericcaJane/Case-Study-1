import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const API_URL = 'http://localhost:5000/residents/view';

function ViewData() {
  const [employmentChart, setEmploymentChart] = useState([]);
    const [civilStatusChart, setCivilStatusChart] = useState([]);
    const [genderEmploymentChart, setGenderEmploymentChart] = useState([]);
    const [genderChart, setGenderChart] = useState([]);
    const [ageChart, setAgeChart] = useState([]);

  const fetchResidents = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      processChartData(response.data);
    } catch (error) {
      console.error("Error fetching residents:", error.response?.data || error.message);
    }
  }, []);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  
  const processChartData = (residents) => {
    const employmentData = residents.reduce((acc, resident) => {
      acc[resident.employmentStatus] = (acc[resident.employmentStatus] || 0) + 1;
      return acc;
    }, {});
    setEmploymentChart(Object.keys(employmentData).map((key) => ({ name: key, value: employmentData[key] })));

    const civilStatusData = residents.reduce((acc, resident) => {
      acc[resident.civilStatus] = (acc[resident.civilStatus] || 0) + 1;
      return acc;
    }, {});
    setCivilStatusChart(Object.keys(civilStatusData).map((key) => ({ name: key, value: civilStatusData[key] })));

    const genderEmploymentData = residents.reduce((acc, resident) => {
      const gender = resident.gender;
      const employment = resident.employmentStatus;
      if (!acc[employment]) acc[employment] = { employment, male: 0, female: 0 };
      acc[employment][gender.toLowerCase()] += 1;
      return acc;
    }, {});
    setGenderEmploymentChart(Object.values(genderEmploymentData));

    const genderData = residents.reduce((acc, resident) => {
      acc[resident.gender] = (acc[resident.gender] || 0) + 1;
      return acc;
    }, {});
    setGenderChart(Object.keys(genderData).map((key) => ({ name: key, value: genderData[key] })));

    const ageData = residents.reduce((acc, resident) => {
      acc[resident.age] = (acc[resident.age] || 0) + 1;
      return acc;
    }, {});
    setAgeChart(Object.keys(ageData).map((key) => ({ age: key, count: ageData[key] })));
  };

  const COLORS = ['#9ac5e5', '#4fb19d', '#edce7a', '#c98c9a', '#e5c6c3'];

  return (

    
    
     <div className="view-data">
  
      {/* Gender Distribution */}
      <h2>Gender Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={genderChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}  fill="#8884d8" label>
            {genderChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

             {/* Age Distribution - Bar Chart */}
      <h2>Age Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={ageChart}>
          <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -1 }} />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="count" fill="#edce7a" />
        </BarChart>
      </ResponsiveContainer>



      {/* Employment Status Distribution */}
      <h2>Employment Status Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={employmentChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {employmentChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Civil Status Distribution */}
      <h2>Civil Status Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={civilStatusChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {civilStatusChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Gender and Employment Status */}
      <h2>Gender and Employment Status Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={genderEmploymentChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="employment" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="male" stackId="a" fill="#edce7a" />
          <Bar dataKey="female" stackId="a" fill="#4fb19d" />
        </BarChart>
      </ResponsiveContainer>
           
      <ToastContainer />
    </div>
  );

}

export default ViewData;
