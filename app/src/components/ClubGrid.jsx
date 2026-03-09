import { useState } from "react";
import ClubCard from "./ClubCard";

export default function ClubGrid({ title, clubs }) {
  const [category, setCategory] = useState("");

  const filteredClubs = category
    ? clubs.filter((club) => club.category === category)
    : clubs;

  return (
    <>
      <div className="page-title">{title}</div>

      <div className="student-filter">
        <span>Filter by:</span>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option>STEM</option>
          <option>Humanities</option>
          <option>Art</option>
          <option>Community Service</option>
          <option>Culture/Language</option>
          <option>Leadership</option>
          <option>Other</option>
        </select>
        <button className="clear" onClick={() => setCategory("")}>CLEAR</button>
      </div>

      <div className="club-grid">
        {filteredClubs.map((club, i) => (
          <ClubCard key={i} club={club} />
        ))}
      </div>
    </>
  );
}
