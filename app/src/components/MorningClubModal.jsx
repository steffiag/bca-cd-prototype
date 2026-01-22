import { useState, useEffect } from "react";

export default function EditClubModal({ club, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    clubName: club.club || "",
    email: club.email || "",
    category: club.category || "",
    advisor: club.advisor || "",
    room: club.room || "",
    day: club.day || "",
    time: club.time || "",
    members: club.membersRaw || "",
    status: club.status || "Pending",
    merge: club.merge || "Pending",
  });

  useEffect(() => {
    if (club && isOpen) {
      setFormData({
        clubName: club.club || "",
        email: club.email || "",
        category: club.category || "",
        advisor: club.advisor || "",
        room: club.room || "",
        day: club.day || "",
        time: club.time || "",
        members: club.membersRaw || "",
        status: club.status || "Pending",
        merge: club.merge || "No",
      });
    }
  }, [club, isOpen]);

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
  const textareaStyle = { ...inputStyle, resize: "none" };

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
        overflow: "auto", // ADD THIS
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
          maxHeight: "90vh", // ADD THIS
          overflowY: "auto", // ADD THIS
          color: "#1e3a5f",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          margin: "auto", // ADD THIS
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "#4672a1", marginBottom: "20px", textAlign: "center" }}>
          {club.isNew ? "Add New Club" : "Edit Club Info"}
        </h2>

        <div style={fieldStyle}>
          <label>Club Name:</label>
          <input type="text" name="clubName" value={formData.clubName} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} style={selectStyle}>
            <option value="">-- Select --</option>
            <option>STEM</option>
            <option>Humanities</option>
            <option>Art</option>
            <option>Community Service</option>
            <option>Culture/Language</option>
            <option>Leadership</option>
            <option>Other</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Advisor:</label>
          <input type="text" name="advisor" value={formData.advisor} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Room:</label>
          <input type="text" name="room" value={formData.room} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Day:</label>
          <input type="text" name="day" value={formData.day} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Time:</label>
          <input type="text" name="time" value={formData.time} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={fieldStyle}>
          <label>Members:</label>
          <textarea
            name="members"
            value={formData.members}
            onChange={handleChange}
            rows={3}
            placeholder="Enter member names separated by commas"
            style={textareaStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange} style={selectStyle}>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Merge?</label>
          <select name="merge" value={formData.merge} onChange={handleChange} style={selectStyle}>
            <option>No</option>
            <option>Yes</option>
          </select>
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