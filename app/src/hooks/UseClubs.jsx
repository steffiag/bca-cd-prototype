import { useState, useEffect } from "react";
import axios from "axios";

export function useClubs(type) {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClubs() {
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

            return {
              name: c.club,
              mission: c.mission,
              members: c.members || "N/A",
              image: `/images/${fileName}`, 
            };
          })
        );
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
        setError("Could not load clubs.");
      } finally {
        setLoading(false);
      }
    }

    fetchClubs();
  }, [type]);

  return { clubs, loading, error };
}