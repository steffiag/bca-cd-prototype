import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useClubs(type) {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        type === "morning"
          ? "http://localhost:4000/approved-morning-clubs"
          : "http://localhost:4000/approved-wednesday-clubs";

      const res = await axios.get(endpoint, { withCredentials: true });

      setClubs(
        res.data.map((c) => {
          const fileName = c.club.replace(/[^a-z0-9]/gi, "_") + ".png";
          const count = c.members ? c.members.split(",").filter(Boolean).length : 0;
          return {
            dbId: c.dbId,
            name: c.club,
            mission: c.mission,
            members: count,
            image: `/images/${fileName}`,
            type,
          };
        })
      );
    } catch (err) {
      console.error("Failed to fetch clubs:", err);
      setError("Could not load clubs.");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return { clubs, loading, error, refresh: fetchClubs };
}