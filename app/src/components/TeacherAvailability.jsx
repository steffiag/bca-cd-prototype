import { useState, useEffect } from "react";

export default function TeacherAvailability() {
  const [teachers, setTeachers] = useState([]);
  const [filters, setFilters] = useState({ available: "", assigned: "" });

  useEffect(() => {
    fetch("http://localhost:4000/teacher-availability", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error(err));
  }, []);

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
          <select>
            <option>-- Select --</option>
            <option>Add Club</option>
            <option>Archive Clubs</option>
            <option>Add Teacher</option>
            <option>Reset Availability</option>
          </select>
        </div>
      </div>

      <button style={{ marginBottom: "1rem" }}>
        Send Email to Teachers Who Haven’t Responded
      </button>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Rm #</th>
            <th>Available</th>
            <th>Department</th>
            <th>Assigned to Club</th>
            <th>View/Edit</th>
          </tr>
        </thead>
        <tbody>
    {teachers.map((teacher, i) => (
        <tr key={i}>
        <td>🗑️</td>
        <td>{teacher.name}</td>
        <td>{teacher.email}</td>
        <td>{teacher.room}</td>
        <td>{teacher.available}</td>
        <td>{teacher.department}</td>
        <td>
    <select value={teacher.assigned || ""}>
        {teacher.assigned && (
        <option value={teacher.assigned}>{teacher.assigned}</option>
        )}
        {teacher.availableClubs
        ?.filter((club) => club !== teacher.assigned)
        .map((club, idx) => (
            <option key={idx} value={club}>
            {club}
            </option>
        ))}
        {!teacher.assigned && !teacher.availableClubs?.length && (
        <option>Unassigned</option>
        )}
    </select>
</td>

      <td>
        <button>View/Edit</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
