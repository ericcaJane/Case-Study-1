import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './main.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineSearch } from 'react-icons/ai'; 
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:5000/residents';

function AdminDashboard() {
  const [formData, setFormData] = useState({ 
    id: '', 
    name: '', 
    age: '', 
    gender: '', 
    employmentStatus: "", 
    civilStatus: "", 
    address: "", 
    contact: "", 
    householdNumber: "", 
    source: "manual" 
  });
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchResidents = async () => {
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeaders() });
      setResidents(response.data);
      setFilteredResidents(response.data);
    } catch (error) {
      console.error("Error fetching residents:", error);
      toast.error("Unauthorized! Please log in.");
    }
  };
  
  useEffect(() => {
    fetchResidents();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData, { headers: getAuthHeaders() });
      toast.success('Resident added successfully!');
      fetchResidents();
      resetForm();
    } catch (error) {
      console.error('Error adding resident:', error);
      toast.error('Error adding resident!');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${formData.id}`, formData, { headers: getAuthHeaders() });
      toast.success('Resident updated successfully!');
      fetchResidents();
      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating resident:', error);
      toast.error('Error updating resident!');
    }
  };

  // Delete resident
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      toast.success('Resident deleted!');
      fetchResidents();
    } catch (error) {
      toast.error('Error deleting resident!');
    }
  };

  // Populate form for updating resident
  const handleEdit = (resident) => {
    setFormData({
      id: resident.id,
      name: resident.name,
      age: resident.age,
      gender: resident.gender,
      employmentStatus: resident.employmentStatus,
      civilStatus: resident.civilStatus,
      address: resident.address,
      contact: resident.contact,
      householdNumber: resident.householdNumber,
      source: "manual"
    });
    setIsEditing(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSearch = (term) => {
    const results = residents.filter((resident) => {
      return (
        resident.id.toLowerCase().includes(term.toLowerCase()) ||
        resident.name.toLowerCase().includes(term.toLowerCase()) ||
        resident.age.toLowerCase().includes(term.toLowerCase()) ||
        resident.gender.toLowerCase().includes(term.toLowerCase()) ||
        resident.employmentStatus.toLowerCase().includes(term.toLowerCase()) ||
        resident.civilStatus.toLowerCase().includes(term.toLowerCase()) ||
        resident.address.toLowerCase().includes(term.toLowerCase()) ||
        resident.contact.toLowerCase().includes(term.toLowerCase()) ||
        resident.householdNumber.toLowerCase().includes(term.toLowerCase())
      );
    });
    setFilteredResidents(results);
  };

  const resetForm = () => {
    setFormData({
      resident_id: "",
      name: "",
      age: "",
      gender: "",
      employmentStatus: "",
      civilStatus: "",
      address: "",
      contact: "",
      householdNumber: "",
      source: "manual"
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      fetchResidents();
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Error uploading file');
    }
  };

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h1>Resident CRUD with Redis</h1>

      <form 
        onSubmit={isEditing ? handleEditSubmit : handleAddSubmit} 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px', 
          maxWidth: '600px', 
          margin: 'auto' 
        }}
      >
        <input type="text" name="resident_id" placeholder="ID" value={formData.resident_id || ''} onChange={handleChange} required disabled={isEditing} />
        <input type="text" name="name" placeholder="Name" value={formData.name || ''} onChange={handleChange} required />
        <input type="age" name="age" placeholder="Age" value={formData.age || ''} onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gender" value={formData.gender || ''} onChange={handleChange} required />
        <input type="text" name="employmentStatus" placeholder="Employment Status" value={formData.employmentStatus || ''} onChange={handleChange} required />
        <input type="text" name="civilStatus" placeholder="Civil Status" value={formData.civilStatus || ''} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address || ''} onChange={handleChange} required />
        <input type="text" name="contact" placeholder="Contact" value={formData.contact || ''} onChange={handleChange} required />
        <input type="text" name="householdNumber" placeholder="Household Number" value={formData.householdNumber || ''} onChange={handleChange} required />
        <button type="submit" style={{ gridColumn: "span 2" }}>
          {isEditing ? "Update Resident" : "Add Resident"}
        </button>
      </form>

      {/* CSV Upload Section */}
      <div className="csv-upload-container">
        <h2>CSV File</h2>
        <label htmlFor="csv-upload" className="file-upload-label">
          Choose File
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef} // Attach the ref to the input
        />
        <button className="file-upload-button" onClick={handleFileUpload}>
          Upload CSV
        </button>
        {file && (
          <div className="file-upload-status">
            Selected file: {file.name}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <AiOutlineSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search "
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <h2>Resident List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Employment Status</th><th>Civil Status</th><th>Address</th><th>Contact</th><th>Household No.</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {filteredResidents.map((resident) => (
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
              <td>
                <button onClick={() => handleEdit(resident)}>Edit</button>
                <button onClick={() => handleDelete(resident.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <ToastContainer />  
    </div>
  );
}

export default AdminDashboard;