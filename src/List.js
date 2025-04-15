import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/residents/view";

function List() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching residents...");

    axios.get(API_URL)
      .then((response) => {
        console.log("Residents fetched:", response.data);
        setResidents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching residents:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-list">
      <h2>Resident List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Employment Status</th>
            <th>Civil Status</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Household Number</th>
          </tr>
        </thead>
        <tbody>
          {residents.length > 0 ? (
            residents.map((resident) => (
              <tr key={resident.id}>
                <td>{resident.id}</td>
                <td>{resident.name}</td>
                <td>{resident.age}</td>
                <td>{resident.gender}</td>
                <td>{resident.employmentStatus}</td>
                <td>{resident.civilStatus}</td>
                <td>{resident.address}</td>
                <td>{resident.contact}</td>
                <td>{resident.householdNumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No residents found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default List;
