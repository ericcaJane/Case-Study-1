import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineSearch, AiOutlineUpload } from 'react-icons/ai';

const API_URL = 'http://localhost:5000/residents';

function ResidentList() {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentResident, setCurrentResident] = useState(null);
  const fileInputRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeaders() });
      setResidents(response.data);
      setFilteredResidents(response.data);
    } catch (error) {
      toast.error("Unauthorized! Please log in.");
    }
  };

  const handleEdit = (resident) => {
    setCurrentResident(resident);
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setCurrentResident({ ...currentResident, [e.target.name]: e.target.value });
  };

  const handleUpdateResident = async () => {
    try {
      await axios.put(`${API_URL}/${currentResident.id}`, currentResident, { headers: getAuthHeaders() });
      toast.success('Resident updated!');
      fetchResidents();
      setEditModal(false);
    } catch (error) {
      toast.error('Error updating resident!');
    }
  };


  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    setFilteredResidents(
      residents.filter(resident =>
        Object.values(resident).some(attr =>
          attr.toString().toLowerCase().includes(value)
        )
      )
    );
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      toast.success('Resident deleted!');
      fetchResidents();
    } catch {
      toast.error('Error deleting resident!');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchResidents();
      setShowModal(false);
    } catch (error) {
      toast.error("Error uploading file");
    }
  };

  return (
    <div className="view">
      <h1>Resident List</h1>

      <div className="table-actions">
        <button className="upload-csv-button" onClick={() => setShowModal(true)}>
          <AiOutlineUpload className="upload-icon" /> Upload CSV
        </button>
        <div className="search-container">
          <AiOutlineSearch className="search-icon" />
          <input type="text" className="search-input" placeholder="Search residents" value={searchTerm} onChange={handleSearchChange} />
        </div>
      </div>

      <div className="table-container">
        <table className="resident-table">
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
                <td className="action-buttons">
                <button className="edit-btn" onClick={() => handleEdit(resident)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(resident.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Upload CSV</h2>
            <input type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} className="csv-input" />
            <button onClick={handleFileUpload} className="upload-button">Upload</button>
            <button onClick={() => setShowModal(false)} className="close-button">X</button>
          </div>
        </div>
      )}

{editModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Resident</h2>
            <input type="text" name="name" value={currentResident.name} onChange={handleEditChange} />
            <input type="text" name="age" value={currentResident.age} onChange={handleEditChange} />
            <input type="text" name="gender" value={currentResident.gender} onChange={handleEditChange} />
            <input type="text" name="employmentStatus" value={currentResident.employmentStatus} onChange={handleEditChange} />
            <input type="text" name="civilStatus" value={currentResident.civilStatus} onChange={handleEditChange} />
            <input type="text" name="address" value={currentResident.address} onChange={handleEditChange} />
            <input type="text" name="contact" value={currentResident.contact} onChange={handleEditChange} />
            <input type="text" name="householdNumber" value={currentResident.householdNumber} onChange={handleEditChange} />
            <button onClick={handleUpdateResident} className="save-button">Save</button>
            <button onClick={() => setEditModal(false)} className="close-button">×</button>

          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default ResidentList;