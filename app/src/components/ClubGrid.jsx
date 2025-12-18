import ClubCard from "./ClubCard";

export default function ClubGrid({ title, clubs }) {
  return (
    <>
      <div className="page-title">{title}</div>

      <div className="student-filter">
        <span>Filter by:</span>
        <select>
          <option>All</option>
          <option>STEM</option>
          <option>Humanities</option>
          <option>Art</option>
          <option>Other</option>
        </select>
        <button className="clear">CLEAR</button>
        <button className="enter">ENTER</button>
      </div>

      <div className="club-grid">
        {clubs.map((club, i) => (
          <ClubCard key={i} club={club} />
        ))}
      </div>
    </>
  );
}
