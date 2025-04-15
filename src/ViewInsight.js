import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers, FaMale, FaFemale, FaChartBar } from "react-icons/fa";

const API_URL = "http://localhost:5000/residents/view";

const ViewInsight = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setResidents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching residents:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading insights...</p>;
  }

  if (!residents || residents.length === 0) {
    return <p>No residents data available.</p>;
  }

  // Calculate total population
  const totalPopulation = residents.length;

  // Count males and females
  const genderCounts = residents.reduce(
    (acc, resident) => {
      const gender = resident.gender.toLowerCase();
      if (gender === "male") acc.male += 1;
      if (gender === "female") acc.female += 1;
      return acc;
    },
    { male: 0, female: 0 }
  );

  const totalMale = genderCounts.male;
  const totalFemale = genderCounts.female;

  // Calculate age distribution
  const ageData = residents.reduce((acc, resident) => {
    const ageGroup = getAgeGroup(parseInt(resident.age, 10));
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {});

  function getAgeGroup(age) {
    if (age <= 18) return "0-18";
    if (age <= 35) return "19-35";
    if (age <= 60) return "36-60";
    return "60+";
  }

  return (
    <div className="insights-container">
      <h2>View Recent Information</h2>

      <div className="insights-grid">
        {/* Left Column: Total Population, Male, Female */}
        <div className="left-column">
          <div className="insights-card">
            <FaUsers size={30} className="icon" />
            <h3>Total Population</h3>
            <p>{totalPopulation}</p>
          </div>
          <div className="insights-card">
            <FaMale size={30} className="icon" />
            <h3>Total Male</h3>
            <p>{totalMale}</p>
          </div>
          <div className="insights-card">
            <FaFemale size={30} className="icon" />
            <h3>Total Female</h3>
            <p>{totalFemale}</p>
          </div>
        </div>

        {/* Right Column: Age Distribution */}
        <div className="right-column">
          <div className="insights-card age-distribution">
            <FaChartBar size={30} className="icon" />
            <h3>Age Distribution</h3>
            <table>
              <thead>
                <tr>
                  <th>Age Group</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {["0-18", "19-35", "36-60", "60+"].map((group) => (
                  <tr key={group}>
                    <td>{group}</td>
                    <td>{ageData[group] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInsight;
