import { useState, useEffect } from "react";
import TeacherModal from "./TeacherModal";

export default function TeacherAvailability({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [filters, setFilters] = useState({ available: "", assigned: "" });
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if current user is a teacher
  const isTeacher = user?.isTeacher || false;
  const currentUserEmail = user?.email || "";

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    fetch("http://localhost:4000/teacher-availability", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error(err));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredTeachers = teachers.filter((t) => {
    const availableMatch = filters.available ? t.available === filters.available : true;
    const assignedMatch = filters.assigned
      ? (t.assigned ? "Yes" : "No") === filters.assigned
      : true;
    return availableMatch && assignedMatch;
  });

  const handleAddNewTeacher = () => {
    const newTeacher = {
      name: "",
      email: "",
      room: "",
      available: "No",
      availableBool: false,
      department: "",
      assigned: null,
      isNew: true,
    };
    setSelectedTeacher(newTeacher);
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = async (teacher) => {
    if (teacher.source === "google_form") {
      alert("Cannot delete teachers from Google Forms. These must be managed through Google Forms.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      return;
    }

    try {
      const url = `http://localhost:4000/teacher-availability/${teacher.id}/${teacher.source || 'manual'}`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        fetchTeachers();
        alert("Teacher deleted successfully");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete teacher");
      }
    } catch (err) {
      console.error("Error deleting teacher:", err);
      alert("Error deleting teacher");
    }
  };

  const handleAvailabilityCheckbox = async (teacher) => {
    // Only allow teachers to check their own availability
    if (!isTeacher || teacher.email !== currentUserEmail) {
      alert("You can only confirm your own availability");
      return;
    }

    try {
      const newAvailability = !teacher.availableBool;
      const response = await fetch(`http://localhost:4000/teacher-availability/${teacher.id}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ available: newAvailability }),
      });

      if (response.ok) {
        fetchTeachers();
        alert(`Availability set to ${newAvailability ? "Yes" : "No"}`);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update availability");
      }
    } catch (err) {
      console.error("Error updating availability:", err);
      alert("Error updating availability");
    }
  };

  const handleAssignedClubChange = async (teacher, newClub) => {
    try {
      const response = await fetch(`http://localhost:4000/teacher-availability/${teacher.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: teacher.name,
          email: teacher.email,
          room: teacher.room,
          available: teacher.available,
          department: teacher.department,
          assigned_club: newClub === "Unassigned" ? null : newClub,
        }),
      });

      if (response.ok) {
        fetchTeachers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update assignment");
      }
    } catch (err) {
      console.error("Error updating assignment:", err);
      alert("Error updating assignment");
    }
  };

  return (
    <div>
      <div className="page-title">Wednesday Club Teacher Availability</div>

      <div className="controls">
        <div className="filter-box">
          <strong>Filter by:</strong>
          <label>Available:</label>
          <select name="available" value={filters.available} onChange={handleFilterChange}>
            <option value="">-- Select --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <label>Assigned:</label>
          <select name="assigned" value={filters.assigned} onChange={handleFilterChange}>
            <option value="">-- Select --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <br />
          <button onClick={() => setFilters({ available: "", assigned: "" })}>Clear</button>
          <button>Submit</button>
        </div>

        <div className="tools">
          <strong>Other Tools:</strong>
          <br />
          <select
            onChange={(e) => {
              if (e.target.value === "add") {
                handleAddNewTeacher();
                e.target.value = "";
              }
            }}
          >
            <option value="">-- Select --</option>
            <option value="add">Add Teacher</option>
            <option>Archive Teachers</option>
            <option>Reset Availability</option>
          </select>
        </div>
      </div>

      <button 
        style={{ marginBottom: "1rem" }}
        onClick={handleAddNewTeacher}
      >
        + Add New Teacher
      </button>

      <button style={{ marginBottom: "1rem", marginLeft: "1rem" }}>
        Send Email to Teachers Who Haven't Responded
      </button>

      <table>
        <thead>
          <tr>
            <th>Available?</th>
            <th>Name</th>
            <th>Email</th>
            <th>Rm #</th>
            <th>Confirmed</th>
            <th>Department</th>
            <th>Assigned to Club</th>
            <th>View/Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher, i) => (
            <tr key={teacher.id || i}>
              <td>
                <input
                  type="checkbox"
                  checked={teacher.availableBool}
                  onChange={() => handleAvailabilityCheckbox(teacher)}
                  disabled={!isTeacher || teacher.email !== currentUserEmail}
                  style={{
                    cursor: isTeacher && teacher.email === currentUserEmail ? "pointer" : "not-allowed",
                    opacity: isTeacher && teacher.email === currentUserEmail ? 1 : 0.5,
                  }}
                  title={
                    isTeacher && teacher.email === currentUserEmail 
                      ? "Click to confirm your availability" 
                      : "You can only confirm your own availability"
                  }
                />
              </td>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>{teacher.room}</td>
              <td>{teacher.available}</td>
              <td>{teacher.department}</td>
              <td>
                <select
                  value={teacher.assigned || "Unassigned"}
                  onChange={(e) => handleAssignedClubChange(teacher, e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #cfd8e8",
                  }}
                >
                  <option value="Unassigned">Unassigned</option>
                  {teacher.availableClubs?.map((club, idx) => (
                    <option key={idx} value={club}>
                      {club}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button 
                  onClick={() => { 
                    setSelectedTeacher(teacher); 
                    setIsModalOpen(true); 
                  }}
                >
                  View/Edit
                </button>
              </td>
              <td>
                <button 
                  onClick={() => handleDeleteTeacher(teacher)}
                  style={{
                    background: teacher.source === "google_form" ? "#6c757d" : "#dc3545",
                    color: "white",
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: teacher.source === "google_form" ? "not-allowed" : "pointer",
                    opacity: teacher.source === "google_form" ? 0.6 : 1,
                  }}
                  disabled={teacher.source === "google_form"}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTeacher && (
        <TeacherModal
          teacher={selectedTeacher}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTeacher(null);
          }}
          onSave={async (updatedData) => {
            if (selectedTeacher.isNew) {
              try {
                const response = await fetch("http://localhost:4000/teacher-availability", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    name: updatedData.name,
                    email: updatedData.email,
                    room: updatedData.room,
                    available: updatedData.available,
                    department: updatedData.department,
                    assigned_club: updatedData.assigned || null,
                  }),
                });

                if (response.ok) {
                  fetchTeachers();
                  alert("Teacher added successfully!");
                } else {
                  const data = await response.json();
                  alert(data.error || "Failed to add teacher");
                }
              } catch (err) {
                console.error("Error adding teacher:", err);
                alert("Error adding teacher");
              }
            } else {
              try {
                const response = await fetch(`http://localhost:4000/teacher-availability/${selectedTeacher.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    name: updatedData.name,
                    email: updatedData.email,
                    room: updatedData.room,
                    available: updatedData.available,
                    department: updatedData.department,
                    assigned_club: updatedData.assigned || null,
                  }),
                });

                if (response.ok) {
                  fetchTeachers();
                  alert("Teacher updated successfully!");
                } else {
                  const data = await response.json();
                  alert(data.error || "Failed to update teacher");
                }
              } catch (err) {
                console.error("Error updating teacher:", err);
                alert("Error updating teacher");
              }
            }

            setIsModalOpen(false);
            setSelectedTeacher(null);
          }}
        />
      )}
    </div>
  );
}