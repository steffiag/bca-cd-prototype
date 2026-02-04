import { useState, useEffect } from "react";
import ClubModalContent from "./WednesdayClubModal";

export default function WednesdayClubManagement({ user }) {
  const [clubs, setClubs] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    advisor: "",
  });
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");

  // Check if user is a teacher
  const isTeacher = user?.isTeacher || false;

  useEffect(() => {
    fetch("http://localhost:4000/wednesday-club", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch((err) => console.error(err));
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredClubs = clubs.filter((club) => {
    const categoryMatch = filters.category
      ? club.category === filters.category
      : true;

    const statusMatch = filters.status
      ? club.status === filters.status
      : true;

    const advisorMatch = filters.advisor
      ? club.advisor === filters.advisor
      : true;

    return categoryMatch && statusMatch && advisorMatch;
  });

  const uniqueAdvisors = [...new Set(clubs.map((c) => c.advisor).filter(Boolean))];

  // Function to add a new empty row
  const handleAddNewClub = () => {
    const newClub = {
      club: "",
      email: "",
      category: "",
      advisor: "",
      room: "",
      members: "No",
      membersRaw: "",
      req_advisor: "",
      status: "Pending",
      isNew: true,
    };
    setSelectedClub(newClub);
    setIsModalOpen(true);
  };

  // Function to delete a club
  const handleDeleteClub = async (club) => {
    console.log("Full club object:", club);
    
    if (club.source === "google_form") {
      alert("Cannot delete clubs from Google Forms. These must be managed through Google Forms.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this club?")) {
      return;
    }

    try {
      const identifier = club.dbId || club.email;
      
      if (!identifier) {
        alert("Cannot delete: no identifier found for this club");
        return;
      }
      
      const url = `http://localhost:4000/wednesday-club/${identifier}/${club.source || 'manual'}`;
      console.log("DELETE URL:", url);
      
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setClubs(clubs.filter((c) => c.dbId !== club.dbId));
        alert("Club deleted successfully");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete club");
      }
    } catch (err) {
      console.error("Error deleting club:", err);
      alert("Error deleting club");
    }
  };
  const toggleClubSelection = (clubId) => {
  setSelectedClubs((prev) =>
    prev.includes(clubId)
      ? prev.filter((id) => id !== clubId)
      : [...prev, clubId]
  );
};

const handleBulkStatusUpdate = () => {
    setClubs((prev) =>
      prev.map((club) =>
        selectedClubs.includes(club.id)
          ? { ...club, status: bulkStatus }
          : club
      )
    );

    fetch("http://localhost:4000/clubs/bulk-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ids: selectedClubs,
        status: bulkStatus,
      }),
    }).catch(console.error);

    setSelectedClubs([]);
    setBulkStatus("");
  };


  return (
    <div>
      <div className="page-title">Wednesday Club Management</div>

      <div className="controls">
        <div className="filter-box">
          <strong>Filter by:</strong>

          <label>Category:</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">-- Select --</option>
            <option>STEM</option>
            <option>Art</option>
            <option>Community Service</option>
            <option>Culture/Language</option>
            <option>Humanities</option>
            <option>Leadership</option>
            <option>Other</option>
          </select>

          <label>Status:</label>
          <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">-- Select --</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>

          <button
            disabled={selectedClubs.length === 0 || !bulkStatus}
            onClick={handleBulkStatusUpdate}
          >
            Submit
          </button>

          <label>Advisor:</label>
          <select
            name="advisor"
            value={filters.advisor}
            onChange={handleFilterChange}
          >
            <option value="">-- Select --</option>
            {uniqueAdvisors.map((a, i) => (
              <option key={i}>{a}</option>
            ))}
          </select>

          <br />
          <button onClick={() => setFilters({ category: "", status: "", advisor: "" })}>
            Clear
          </button>
          <button>Submit</button>
        </div>

        <div className="tools">
          <strong>Other Tools:</strong>
          <br />
          <select
            onChange={(e) => {
              if (e.target.value === "add" && isTeacher) {
                handleAddNewClub();
                e.target.value = "";
              }
            }}
          >
            <option value="">-- Select --</option>
            {isTeacher && <option value="add">Add Club</option>}
            <option>Archive Clubs</option>
            <option>Add Teacher</option>
            <option>Reset Availability</option>
          </select>
        </div>
      </div>

      {/* Add New Club Button - Only visible for teachers */}
      {isTeacher && (
        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          <button 
            onClick={handleAddNewClub}
            style={{
              background: "#28a745",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            + Add New Club
          </button>
        </div>
      )}

      <div className="status-update">
        Update selected <strong>STATUS</strong> TO:
        <select
          value={bulkStatus}
          onChange={(e) => setBulkStatus(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>

        <button
          disabled={selectedClubs.length === 0 || !bulkStatus}
          onClick={handleBulkStatusUpdate}
        >
          Submit
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>
            <input
              type="checkbox"
              checked={filteredClubs.length > 0 && filteredClubs.every((c) => selectedClubs.includes(c.id))}
              onChange={() => {
                const allIds = filteredClubs.map((c) => c.id);
                if (filteredClubs.every((c) => selectedClubs.includes(c.id))) {
                  setSelectedClubs([]);
                } else {
                  setSelectedClubs(allIds);
                }
              }}
            />
          </th>
            <th>Club</th>
            <th>Leader Email</th>
            <th>Category</th>
            <th>Advisor</th>
            <th>Meeting Place</th>
            <th>5 members</th>
            <th>Requested Advisor</th>
            <th>Status</th>
            <th>View/Edit</th>
            {isTeacher && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {filteredClubs.map((club, i) => (
            <tr key={club.id}>
              <td>
            <input
              type="checkbox"
              checked={selectedClubs.includes(club.id)}
              onChange={() => toggleClubSelection(club.id)}
            />
          </td>
              <td>{club.club}</td>
              <td>{club.email}</td>
              <td>{club.category}</td>
              <td>{club.advisor}</td>
              <td>{club.room}</td>
              <td>{club.members}</td>
              <td>{club.req_advisor}</td>
              <td>{club.status}</td>
              <td>
                <button onClick={() => { setSelectedClub(club); setIsModalOpen(true); }}>
                  Edit
                </button>
              </td>
              {isTeacher && (
                <td>
                  <button 
                    onClick={() => handleDeleteClub(club)}
                    style={{
                      background: club.source === "google_form" ? "#6c757d" : "#dc3545",
                      color: "white",
                      padding: "4px 8px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: club.source === "google_form" ? "not-allowed" : "pointer",
                      opacity: club.source === "google_form" ? 0.6 : 1,
                    }}
                    disabled={club.source === "google_form"}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedClub && (
        <ClubModalContent
          club={selectedClub}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClub(null);
          }}
          onSave={async (updatedData) => {
            if (selectedClub.isNew) {
              // For new clubs, save to backend
              try {
                const newClub = {
                  club: updatedData.clubName,
                  email: updatedData.email,
                  category: updatedData.category,
                  advisor: updatedData.advisor,
                  room: updatedData.room,
                  members: updatedData.members,
                  membersRaw: updatedData.members,
                  req_advisor: "",
                  status: updatedData.status,
                };

                const response = await fetch("http://localhost:4000/wednesday-club", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify(newClub),
                });

                if (response.ok) {
                  // Refresh the clubs list from the server
                  const refreshResponse = await fetch("http://localhost:4000/wednesday-club", { credentials: "include" });
                  const updatedClubs = await refreshResponse.json();
                  setClubs(updatedClubs);
                  alert("Club added successfully!");
                } else {
                  alert("Failed to add club");
                }
              } catch (err) {
                console.error("Error adding club:", err);
                alert("Error adding club");
              }
            } else {
              // For existing clubs, update in place
              setClubs((prev) =>
                prev.map((c) =>
                  c.email === selectedClub.email
                    ? {
                        ...c,
                        club: updatedData.clubName,
                        email: updatedData.email,
                        category: updatedData.category,
                        advisor: updatedData.advisor,
                        room: updatedData.room,
                        members: updatedData.members.split(",").filter(Boolean).length >= 5 ? "Yes" : "No",
                        membersRaw: updatedData.members,
                        status: updatedData.status,
                      }
                    : c
                )
              );
            }
            setIsModalOpen(false);
            setSelectedClub(null);
          }}
        />
      )}
    </div>
  );
}