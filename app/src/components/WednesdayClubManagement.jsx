import { useState, useEffect } from "react";
import ClubModalContent from "./WednesdayClubModal";

export default function WednesdayClubManagement() {
  const [clubs, setClubs] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    advisor: "",
  });
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <select>
            <option>-- Select --</option>
            <option>Add Club</option>
            <option>Archive Clubs</option>
            <option>Add Teacher</option>
            <option>Reset Availability</option>
          </select>
        </div>
      </div>

      <div className="status-update">
        Update selected <strong>STATUS</strong> TO:
        <select>
          <option>-- Select --</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
        <button>Submit</button>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Club</th>
            <th>Leader Email</th>
            <th>Category</th>
            <th>Advisor</th>
            <th>Meeting Place</th>
            <th>5 members</th>
            <th>Requested Advisor</th>
            <th>Status</th>
            <th>View/Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredClubs.map((club, i) => (
            <tr key={i}>
              <td><div className="checkbox"></div></td>
              <td>{club.club}</td>
              <td>{club.email}</td>
              <td>{club.category}</td>
              <td>{club.advisor}</td>
              <td>{club.room}</td>
              <td>{club.members}</td>
              <td>{club.req_advisor}</td>
              <td>{club.status}</td>
              <td><button onClick={() => { setSelectedClub(club); setIsModalOpen(true);}}> Edit </button></td>
            </tr>
          ))}
        </tbody>

        {selectedClub && (
        <ClubModalContent
            club={selectedClub}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={(updatedData) => {
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
                        members:
                        updatedData.members
                            .split(",")
                            .filter(Boolean).length >= 5
                            ? "Yes"
                            : "No",
                        membersRaw: updatedData.members,

                        status: updatedData.status,
                    }
                    : c
                )
            );
            }}
        />
        )}
      </table>
    </div>
  );
}
