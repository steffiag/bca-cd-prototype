import React, { useEffect, useState } from "react";
import ClubCard from "../ClubCard";

export default function WednesdayClubSignup() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await fetch("/wednesday-club");
        const data = await res.json();

        const approved = data.filter(
          (c) => c.status === "Approved" && c.mission && c.photo_file_id
        ).map((c) => ({
          name: c.club,
          mission: c.mission,
          image: `https://drive.google.com/uc?export=view&id=${c.photo_file_id}`,
        }));

        setClubs(approved);
      } catch (err) {
        console.error(err);
      }
    }

    fetchClubs();
  }, []);

  return (
    <div>
      <h2>Wednesday Club Signup</h2>
      <div className="club-grid">
        {clubs.map((club, i) => (
          <ClubCard key={i} club={club} />
        ))}
      </div>
    </div>
  );
}