import { useState, useEffect } from "react";

export default function EditClubModal({ club, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    clubName: club.club || "",
    email: club.email || "",
    category: club.category || "",
    advisor: club.advisor || "",
    room: club.room || "",
    members: club.membersRaw || "",
    status: club.status || "Pending",
    mission: club.mission || "", 
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageVersion, setImageVersion] = useState(Date.now());

  const safeName = club.club?.replace(/[^a-z0-9]/gi, "_");

  useEffect(() => {
      if (club && isOpen) {
        setFormData({
          clubName: club.club || "",
          email: club.email || "",
          category: club.category || "",
          advisor: club.advisor || "",
          room: club.room || "",
          members: club.membersRaw || "",
          status: club.status || "Pending",
          mission: club.mission || "",
        });
        setImagePreview( club.club ? `/images/${club.club.replace(/[^a-z0-9]/gi, "_")}.png` : null );
        setImageFile(null);
      }
    }, [club, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const saveData = {
        club: formData.clubName,
        email: formData.email,
        category: formData.category,
        advisor: formData.advisor,
        room: formData.room,
        day: formData.day,
        time: formData.time,
        members: formData.members,
        status: formData.status,
        merge: formData.merge,
        mission: formData.mission,
      };

      const response = await fetch(
        `http://localhost:4000/wednesday-club/${club.dbId}`,
        {
          method: club.isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(saveData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Club save failed:", data);
        alert("Failed to save club: " + (data.error || response.status));
        return;
      }

      if (imageFile) {
        const safeName = formData.clubName.replace(/\s+/g, "_");
        const formDataImg = new FormData();
        formDataImg.append("image", imageFile);

        await fetch(
          `http://localhost:4000/upload-club-image/${safeName}`,
          {
            method: "POST",
            credentials: "include",
            body: formDataImg,
          }
        );
        setImageVersion(Date.now());
      }
      onSave({ ...saveData, dbId: club.dbId });
      onClose();
    } catch (err) {
      console.error("Error saving club:", err, err.stack);
      alert("Failed to save club: " + err.message);
    }
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
  const existingImage = `/images/${club.club?.replace(/[^a-z0-9]/gi, "_")}.png`;

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
        <label>Mission Statement:</label>
        <textarea
          name="mission"
          value={formData.mission}
          onChange={handleChange}
          rows={3}
          placeholder="Enter mission statement"
          style={textareaStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label>Club Image:</label>
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "8px",
            border: "1px solid #cfd8e8",
            overflow: "hidden",
            background: "#f0f4f8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imagePreview ? (
            <img
              src={
                imagePreview?.startsWith("blob:")
                  ? imagePreview
                  : `${imagePreview}?v=${imageVersion}`
              }
              alt="Club"
              onError={() => setImagePreview(null)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <p style={{ margin: 0, fontSize: "12px", color: "#9aafc4" }}>
              No image
            </p>
          )}
        </div>
        <label
          style={{
            background: "#5a8fc0",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            marginTop: "8px",

            display: "inline-block",
            width: "fit-content",
          }}
        >
          {imagePreview ? "Change Image" : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>
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