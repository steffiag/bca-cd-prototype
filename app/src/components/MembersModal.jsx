export default function MembersModal({ club, members, onClose }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(30,58,95,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", padding: "25px", borderRadius: "20px", width: "400px", maxHeight: "80vh", overflowY: "auto", color: "#1e3a5f", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "#4672a1", marginBottom: "16px", textAlign: "center"}}>{club.club}</h2>
        {members.length === 0 ? ( <p style={{ color: "#888", textAlign: "center" }}> No members enrolled yet. </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #cfd8e8", paddingBottom: "8px" }}>Name</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #cfd8e8", paddingBottom: "8px" }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={i}>
                  <td style={{ padding: "6px 0" }}>{m.User?.usr_first_name} {m.User?.usr_last_name}</td>
                  <td style={{ padding: "6px 0" }}>{m.User?.usr_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={onClose}
          style={{ marginTop: "20px", background: "#9e9e9e", color: "white", padding: "8px 16px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
        >
          Close
        </button>
      </div>
    </div>
  );
}