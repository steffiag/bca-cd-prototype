import { useState, useEffect } from "react";

export default function TeacherModal({ teacher, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: teacher.name || "",
    email: teacher.email || "",
    room: teacher.room || "",
    available: teacher.available || "No",
    department: teacher.department || "",
    assigned: teacher.assigned || "",
  });

  useEffect(() => {
    if (teacher && isOpen) {
      setFormData({
        name: teacher.name || "",
        email: teacher.email || "",
        room: teacher.room || "",
        available: teacher.available || "No",
        department: teacher.department || "",
        assigned: teacher.assigned || "",
      });
    }
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "12px",
    textAlign: "left",
  };

  const inputStyle = {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #cfd8e8",
    outline: "none",
    marginTop: "4px",
  };

  const selectStyle = { ...inputStyle, cursor: "pointer" };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30, 58, 95, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        overflow: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "25px",
          borderRadius: "20px",
          width: "500px",
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflowY: "auto",
          color: "#1e3a5f",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          margin: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "#4672a1", marginBottom: "20px", textAlign: "center" }}>
          {teacher.isNew ? "Add New Teacher" : "Edit Teacher Info"}
        </h2>

        <div style={fieldStyle}>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            style={inputStyle} 
          />
        </div>

        <div style={fieldStyle}>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            style={inputStyle} 
          />
        </div>

        <div style={fieldStyle}>
          <label>Room Number:</label>
          <input 
            type="text" 
            name="room" 
            value={formData.room} 
            onChange={handleChange} 
            style={inputStyle} 
          />
        </div>

        <div style={fieldStyle}>
          <label>Available:</label>
          <select 
            name="available" 
            value={formData.available} 
            onChange={handleChange} 
            style={selectStyle}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Department:</label>
          <input 
            type="text" 
            name="department" 
            value={formData.department} 
            onChange={handleChange} 
            style={inputStyle} 
            placeholder="e.g., Mathematics, Science, English"
          />
        </div>

        <div style={fieldStyle}>
          <label>Assigned Club:</label>
          <input 
            type="text" 
            name="assigned" 
            value={formData.assigned} 
            onChange={handleChange} 
            style={inputStyle} 
            placeholder="Leave empty if unassigned"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
          <button
            style={{
              background: "#9e9e9e",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            style={{
              background: "#5a8fc0",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}