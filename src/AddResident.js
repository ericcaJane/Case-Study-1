import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/residents';

function AddResident() {
  const [formData, setFormData] = useState({ 
    resident_id: '', name: '', age: '', gender: '', employmentStatus: '', civilStatus: '', address: '', contact: '', householdNumber: '', source: 'manual'
  });

  const [showModal, setShowModal] = useState(false);
  const [addedResident, setAddedResident] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resident_id) {
      toast.error("Resident ID is required!");
      return;
    }

    try {
      await axios.post(API_URL, formData, { headers: getAuthHeaders() });
      toast.success("Resident added successfully!");
      
      setAddedResident(formData);
      setShowModal(true);
      
      resetForm();
    } catch (error) {
      console.error("Error adding resident:", error);
      toast.error("Error adding resident!");
    }
  };

  const resetForm = () => {
    setFormData({ 
      resident_id: '', name: '', age: '', gender: '', employmentStatus: '', 
      civilStatus: '', address: '', contact: '', householdNumber: '', source: 'manual' 
    });
  };

  return (
    <div className="content">
      <h1>Add Resident</h1>

      <div className="form-container">
        <form onSubmit={handleAddSubmit}>
          <input 
            type="text" 
            name="resident_id" 
            placeholder="ID" 
            value={formData.resident_id || ''} 
            onChange={handleChange} 
            required 
          />
          <input type="text" name="name" placeholder="Name" value={formData.name || ''} onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" value={formData.age || ''} onChange={handleChange} required />
          <input type="text" name="gender" placeholder="Gender" value={formData.gender || ''} onChange={handleChange} required />
          <input type="text" name="employmentStatus" placeholder="Employment Status" value={formData.employmentStatus || ''} onChange={handleChange} required />
          <input type="text" name="civilStatus" placeholder="Civil Status" value={formData.civilStatus || ''} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" value={formData.address || ''} onChange={handleChange} required />
          <input type="text" name="contact" placeholder="Contact" value={formData.contact || ''} onChange={handleChange} required />
          <input type="text" name="householdNumber" placeholder="Household Number" value={formData.householdNumber || ''} onChange={handleChange} required />
          <button type="submit" className="bu">Add Resident</button>
        </form>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Resident Added</h2>
            {addedResident && (
              <>
                <p><strong>ID:</strong> {addedResident.resident_id}</p>
                <p><strong>Name:</strong> {addedResident.name}</p>
                <p><strong>Age:</strong> {addedResident.age}</p>
                <p><strong>Gender:</strong> {addedResident.gender}</p>
                <p><strong>Employment Status:</strong> {addedResident.employmentStatus}</p>
                <p><strong>Civil Status:</strong> {addedResident.civilStatus}</p>
                <p><strong>Address:</strong> {addedResident.address}</p>
                <p><strong>Contact:</strong> {addedResident.contact}</p>
                <p><strong>Household Number:</strong> {addedResident.householdNumber}</p>
              </>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default AddResident;
