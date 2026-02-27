import { useAuth } from "../hooks/UseAuth";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ClubCard({ club }) {
  const { currentUser, loading } = useAuth();
  const [joined, setJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(club.members || 0);

  // Check if user is already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.get(
          `http://localhost:4000/user-clubs/${currentUser.email}`,
          { withCredentials: true }
        );
        const isEnrolled = res.data.enrollments.some(
          e => e.club_id === club.dbId && e.club_type === club.type
        );
        setJoined(isEnrolled);
      } catch (err) {
        console.error("Failed to check enrollment:", err);
      }
    };
    checkEnrollment();
  }, [currentUser, club]);

  useEffect(() => {
  refreshMemberCount();
}, [club.dbId]);

  const refreshMemberCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/club/${club.dbId}/members?type=${club.type}`,
        { withCredentials: true }
      );
      setMemberCount(res.data.members.length);
    } catch (err) {
      console.error("Failed to refresh member count:", err);
    }
  };

  const handleJoin = async () => {
    if (!currentUser) return alert("You must be logged in to join a club.");

    try {
      await axios.post(
        "http://localhost:4000/club-enrollments",
        {
          user_id: currentUser.email,
          club_id: club.dbId,
          club_type: club.type,
        },
        { withCredentials: true }
      );
      setJoined(true);
      await refreshMemberCount();
      alert("Joined successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to join club");
    }
  };

  const handleLeave = async () => {
    if (!currentUser) return alert("You must be logged in to leave a club.");

    try {
      await axios.delete(
        "http://localhost:4000/club-enrollments",
        {
          data: {
            user_id: currentUser.email,
            club_id: club.dbId,
            club_type: club.type,
          },
          withCredentials: true,
        }
      );
      setJoined(false);
      await refreshMemberCount();
      alert("Left the club.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to leave club");
    }
  };

  return (
    <div className="club-card">
      <div
        className="club-card-image"
        style={{ backgroundImage: `url(${club.image})` }}
      >
        <div className="club-card-title">{club.name}</div>

        <div className="club-card-overlay">
          <h3>{club.name}</h3>
          <p className="mission">{club.mission}</p>
          <p className="members">Members: {memberCount}</p>
          {joined ? (
            <button className="leave-btn" onClick={handleLeave} disabled={loading || !currentUser}>
              LEAVE
            </button>
          ) : (
            <button className="join-btn" onClick={handleJoin} disabled={loading || !currentUser}>
              JOIN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}