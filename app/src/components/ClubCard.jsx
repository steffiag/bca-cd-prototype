export default function ClubCard({ club }) {
  return (
    <div className="club-card">
      <div
        className="club-card-image"
        style={{ backgroundImage: `url(${club.image})` }}
      >
        <div className="club-card-title">
          {club.name}
        </div>

        <div className="club-card-overlay">
          <h3>{club.name}</h3>
          <p className="mission">{club.mission}</p>
          <p className="members">Members: {club.members}</p>
          <button className="join-btn">JOIN</button>
        </div>
      </div>
    </div>
  );
}
