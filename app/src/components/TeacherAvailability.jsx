import { useState, useEffect, useRef } from "react";
import TeacherModal from "./TeacherModal";

// ─── Inline styles (no external CSS needed) ───────────────────────────────────
const styles = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 100%)",
    minHeight: "100vh",
    padding: "2rem",
    color: "#1a1f36",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.75rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  titleBlock: { display: "flex", flexDirection: "column", gap: "0.25rem" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "#e8eeff",
    color: "#3b5bdb",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "0.25rem 0.7rem",
    borderRadius: "999px",
    width: "fit-content",
  },
  pageTitle: {
    fontSize: "1.7rem",
    fontWeight: 800,
    color: "#1a1f36",
    letterSpacing: "-0.02em",
    margin: 0,
  },
  statsRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  statCard: (color) => ({
    background: "#fff",
    borderRadius: "12px",
    padding: "0.9rem 1.4rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    borderLeft: `4px solid ${color}`,
    minWidth: "140px",
    flex: "1",
  }),
  statNum: (color) => ({
    fontSize: "1.8rem",
    fontWeight: 800,
    color,
    lineHeight: 1,
  }),
  statLabel: {
    fontSize: "0.73rem",
    fontWeight: 600,
    color: "#8390a2",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginTop: "0.2rem",
  },
  toolbar: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-end",
    flexWrap: "wrap",
    background: "#fff",
    borderRadius: "14px",
    padding: "1.1rem 1.4rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    marginBottom: "1.25rem",
  },
  filterGroup: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  filterLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#8390a2", textTransform: "uppercase", letterSpacing: "0.05em" },
  select: {
    padding: "0.42rem 0.8rem",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "0.85rem",
    color: "#1a1f36",
    background: "#fff",
    cursor: "pointer",
    outline: "none",
  },
  spacer: { flex: 1 },
  btnGroup: { display: "flex", gap: "0.6rem", alignItems: "center" },
  btn: (variant) => {
    const base = {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.48rem 1.1rem",
      borderRadius: "8px",
      fontSize: "0.83rem",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      transition: "all 0.15s",
      whiteSpace: "nowrap",
    };
    const variants = {
      primary: { background: "#3b5bdb", color: "#fff" },
      success: { background: "#12b886", color: "#fff" },
      warning: { background: "#f59f00", color: "#fff" },
      danger: { background: "#fa5252", color: "#fff" },
      ghost: { background: "#f1f3f9", color: "#1a1f36" },
      disabled: { background: "#e9ecef", color: "#adb5bd", cursor: "not-allowed" },
    };
    return { ...base, ...(variants[variant] || variants.ghost) };
  },
  tableWrap: {
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "#f8f9fe",
    padding: "0.75rem 1rem",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#8390a2",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    textAlign: "left",
    borderBottom: "1.5px solid #e8ecf5",
  },
  td: {
    padding: "0.85rem 1rem",
    fontSize: "0.87rem",
    borderBottom: "1px solid #f0f2f8",
    verticalAlign: "middle",
  },
  availBadge: (avail) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.22rem 0.7rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    background: avail ? "#d3f9d8" : "#fff0f0",
    color: avail ? "#2f9e44" : "#e03131",
  }),
  assignBadge: (assigned) => ({
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 600,
    background: assigned ? "#e8eeff" : "#f1f3f5",
    color: assigned ? "#3b5bdb" : "#868e96",
  }),
  checkbox: (canEdit) => ({
    width: "18px",
    height: "18px",
    cursor: canEdit ? "pointer" : "not-allowed",
    accentColor: "#3b5bdb",
    opacity: canEdit ? 1 : 0.4,
  }),
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,15,40,0.45)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modal: {
    background: "#fff",
    borderRadius: "18px",
    padding: "2rem",
    width: "100%",
    maxWidth: "560px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  modalTitle: { fontSize: "1.2rem", fontWeight: 800, marginBottom: "1.2rem", color: "#1a1f36" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1rem" },
  inputLabel: { fontSize: "0.78rem", fontWeight: 700, color: "#8390a2", textTransform: "uppercase" },
  input: {
    padding: "0.55rem 0.85rem",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "0.88rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "0.55rem 0.85rem",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "0.85rem",
    outline: "none",
    width: "100%",
    minHeight: "120px",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "monospace",
  },
  toast: (type) => ({
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    background: type === "success" ? "#12b886" : type === "error" ? "#fa5252" : "#3b5bdb",
    color: "#fff",
    padding: "0.8rem 1.4rem",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "0.88rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    zIndex: 2000,
    animation: "slideIn 0.2s ease",
  }),
  dropZone: (dragging) => ({
    border: `2px dashed ${dragging ? "#3b5bdb" : "#c8d0e7"}`,
    borderRadius: "10px",
    padding: "2rem",
    textAlign: "center",
    background: dragging ? "#e8eeff" : "#f8f9fe",
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: "1rem",
  }),
};

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div style={styles.toast(type)}>{message}</div>;
}

// ─── Bulk Import Modal ────────────────────────────────────────────────────────
function BulkImportModal({ onClose, onImport }) {
  const [tab, setTab] = useState("csv");
  const [csvData, setCsvData] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [batchText, setBatchText] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const parseCSV = (text) => {
    const lines = text.trim().split("\n").filter(Boolean);
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const obj = {};
      headers.forEach((h, i) => (obj[h] = vals[i] || ""));
      return obj;
    });
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const rows = parseCSV(e.target.result);
      setCsvData(rows);
      setCsvPreview(rows.slice(0, 5));
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const parseBatch = () => {
    return batchText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((email) => ({ email, name: "", room: "", department: "", available: "No" }));
  };

  const handleImport = () => {
    const rows = tab === "csv" ? csvData : parseBatch();
    if (!rows || rows.length === 0) return;
    onImport(rows);
    onClose();
  };

  const tabBtn = (t) => ({
    padding: "0.45rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.85rem",
    background: tab === t ? "#3b5bdb" : "#f1f3f9",
    color: tab === t ? "#fff" : "#555",
    transition: "all 0.15s",
  });

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>📥 Bulk Import Teachers</h2>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <button style={tabBtn("csv")} onClick={() => setTab("csv")}>CSV Upload</button>
          <button style={tabBtn("batch")} onClick={() => setTab("batch")}>Batch Email Entry</button>
        </div>

        {tab === "csv" ? (
          <>
            <div
              style={styles.dropZone(dragging)}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📂</div>
              <div style={{ fontWeight: 600, color: "#3b5bdb" }}>Drop CSV here or click to browse</div>
              <div style={{ fontSize: "0.78rem", color: "#8390a2", marginTop: "0.3rem" }}>
                Expected columns: name, email, room, department
              </div>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
            </div>

            {csvPreview.length > 0 && (
              <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8390a2", marginBottom: "0.5rem" }}>
                  PREVIEW ({csvData.length} rows)
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr>{["name","email","room","department"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "0.3rem 0.5rem", background: "#f8f9fe", borderBottom: "1.5px solid #e2e8f0", color: "#555", textTransform: "uppercase", fontSize: "0.7rem" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {csvPreview.map((r, i) => (
                      <tr key={i}>
                        {["name","email","room","department"].map(h => (
                          <td key={h} style={{ padding: "0.3rem 0.5rem", borderBottom: "1px solid #f0f2f8" }}>{r[h] || "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 5 && (
                  <div style={{ fontSize: "0.75rem", color: "#8390a2", marginTop: "0.4rem" }}>
                    ...and {csvData.length - 5} more rows
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Paste emails (one per line)</label>
            <textarea
              style={styles.textarea}
              placeholder={"teacher1@school.edu\nteacher2@school.edu\nteacher3@school.edu"}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
            />
            <div style={{ fontSize: "0.75rem", color: "#8390a2" }}>
              {batchText.split("\n").filter(l => l.trim()).length} emails entered
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button style={styles.btn("ghost")} onClick={onClose}>Cancel</button>
          <button
            style={styles.btn(tab === "csv" ? (csvData ? "primary" : "disabled") : (batchText.trim() ? "primary" : "disabled"))}
            onClick={handleImport}
            disabled={tab === "csv" ? !csvData : !batchText.trim()}
          >
            Import Teachers
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Email Preview Modal ──────────────────────────────────────────────────────
function EmailModal({ unconfirmedTeachers, onClose, onSend }) {
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await onSend(unconfirmedTeachers);
    setSending(false);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>📧 Send Availability Reminder</h2>
        <p style={{ color: "#555", fontSize: "0.88rem", marginBottom: "1.2rem" }}>
          The following <strong>{unconfirmedTeachers.length}</strong> teacher{unconfirmedTeachers.length !== 1 ? "s" : ""} haven't confirmed their availability and will receive a reminder email:
        </p>

        <div style={{ maxHeight: "240px", overflowY: "auto", marginBottom: "1.25rem", borderRadius: "8px", border: "1.5px solid #e2e8f0" }}>
          {unconfirmedTeachers.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 1rem", borderBottom: i < unconfirmedTeachers.length - 1 ? "1px solid #f0f2f8" : "none" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e8eeff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#3b5bdb", fontSize: "0.85rem" }}>
                {t.name?.charAt(0) || "?"}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.87rem" }}>{t.name || "Unknown"}</div>
                <div style={{ fontSize: "0.78rem", color: "#8390a2" }}>{t.email}</div>
              </div>
            </div>
          ))}
        </div>

        {unconfirmedTeachers.length === 0 && (
          <div style={{ textAlign: "center", color: "#12b886", fontWeight: 600, padding: "1rem" }}>
            ✅ All teachers have confirmed their availability!
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button style={styles.btn("ghost")} onClick={onClose}>Cancel</button>
          <button
            style={styles.btn(unconfirmedTeachers.length > 0 ? "warning" : "disabled")}
            onClick={handleSend}
            disabled={unconfirmedTeachers.length === 0 || sending}
          >
            {sending ? "Sending..." : `Send ${unconfirmedTeachers.length} Email${unconfirmedTeachers.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeacherAvailability({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [filters, setFilters] = useState({ available: "", assigned: "" });
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const isTeacher = user?.isTeacher || false;
  const currentUserEmail = user?.email || "";

  useEffect(() => { fetchTeachers(); }, []);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchTeachers = () => {
    fetch("http://localhost:4000/teacher-availability", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error(err));
  };

  const totalTeachers = teachers.length;
  const confirmedCount = teachers.filter((t) => t.availableBool).length;
  const assignedCount = teachers.filter((t) => t.assigned).length;
  const unconfirmedTeachers = teachers.filter((t) => !t.availableBool);

  const filteredTeachers = teachers.filter((t) => {
    const availableMatch = filters.available ? t.available === filters.available : true;
    const assignedMatch = filters.assigned ? (t.assigned ? "Yes" : "No") === filters.assigned : true;
    const searchMatch = search
      ? t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase()) ||
        t.department?.toLowerCase().includes(search.toLowerCase())
      : true;
    return availableMatch && assignedMatch && searchMatch;
  });

  const handleAddNewTeacher = () => {
    setSelectedTeacher({ name: "", email: "", room: "", available: "No", availableBool: false, department: "", assigned: null, isNew: true });
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = async (teacher) => {
    if (teacher.source === "google_form") {
      showToast("Cannot delete Google Form teachers", "error");
      return;
    }
    if (!window.confirm(`Delete ${teacher.name}?`)) return;
    try {
      const res = await fetch(`http://localhost:4000/teacher-availability/${teacher.id}/${teacher.source || "manual"}`, {
        method: "DELETE", credentials: "include",
      });
      if (res.ok) { fetchTeachers(); showToast("Teacher deleted"); }
      else { const d = await res.json(); showToast(d.error || "Failed to delete", "error"); }
    } catch { showToast("Error deleting teacher", "error"); }
  };

  const handleAvailabilityCheckbox = async (teacher) => {
    if (!isTeacher || teacher.email !== currentUserEmail) {
      showToast("You can only confirm your own availability", "error");
      return;
    }
    try {
      const newAvail = !teacher.availableBool;
      const res = await fetch(`http://localhost:4000/teacher-availability/${teacher.id}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ available: newAvail }),
      });
      if (res.ok) { fetchTeachers(); showToast(`Availability set to ${newAvail ? "Yes" : "No"}`); }
      else { const d = await res.json(); showToast(d.error || "Failed to update", "error"); }
    } catch { showToast("Error updating availability", "error"); }
  };

  const handleAssignedClubChange = async (teacher, newClub) => {
    try {
      const res = await fetch(`http://localhost:4000/teacher-availability/${teacher.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...teacher, assigned_club: newClub === "Unassigned" ? null : newClub }),
      });
      if (res.ok) fetchTeachers();
      else { const d = await res.json(); showToast(d.error || "Failed to update", "error"); }
    } catch { showToast("Error updating assignment", "error"); }
  };

  const handleSendEmails = async (recipientList) => {
    try {
      const res = await fetch("http://localhost:4000/send-availability-reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teachers: recipientList.map((t) => ({ id: t.id, email: t.email, name: t.name })) }),
      });
      if (res.ok) showToast(`Emails sent to ${recipientList.length} teacher${recipientList.length !== 1 ? "s" : ""}!`);
      else showToast("Failed to send emails", "error");
    } catch {
      showToast("Error sending emails", "error");
    }
  };

  const handleBulkImport = async (rows) => {
    let successCount = 0;
    for (const row of rows) {
      try {
        const res = await fetch("http://localhost:4000/teacher-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: row.name || "",
            email: row.email || "",
            room: row.room || "",
            available: row.available || "No",
            department: row.department || "",
            assigned_club: null,
          }),
        });
        if (res.ok) successCount++;
      } catch {}
    }
    fetchTeachers();
    showToast(`Imported ${successCount} of ${rows.length} teachers`);
  };

  const handleSave = async (updatedData) => {
    const isNew = selectedTeacher?.isNew;
    const url = isNew
      ? "http://localhost:4000/teacher-availability"
      : `http://localhost:4000/teacher-availability/${selectedTeacher.id}`;
    const method = isNew ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: updatedData.name,
          email: updatedData.email,
          room: updatedData.room,
          available: updatedData.available,
          department: updatedData.department,
          assigned_club: updatedData.assigned || null,
        }),
      });
      if (res.ok) { fetchTeachers(); showToast(isNew ? "Teacher added!" : "Teacher updated!"); }
      else { const d = await res.json(); showToast(d.error || "Save failed", "error"); }
    } catch { showToast("Error saving teacher", "error"); }
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        button:hover { filter: brightness(0.93); }
        tr:hover td { background: #fafbff; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleBlock}>
          <div style={styles.badge}>🏫 Teacher Portal</div>
          <h1 style={styles.pageTitle}>Wednesday Club Availability</h1>
        </div>
        <div style={styles.btnGroup}>
          <button style={styles.btn("ghost")} onClick={() => setShowBulkImport(true)}>📥 Bulk Import</button>
          <button
            style={styles.btn(unconfirmedTeachers.length > 0 ? "warning" : "ghost")}
            onClick={() => setShowEmailModal(true)}
          >
            📧 Send Reminders{unconfirmedTeachers.length > 0 && (
              <span style={{ background: "rgba(255,255,255,0.3)", borderRadius: "999px", padding: "0.1rem 0.4rem", fontSize: "0.75rem" }}>
                {unconfirmedTeachers.length}
              </span>
            )}
          </button>
          <button style={styles.btn("primary")} onClick={handleAddNewTeacher}>+ Add Teacher</button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard("#3b5bdb")}>
          <div style={styles.statNum("#3b5bdb")}>{totalTeachers}</div>
          <div style={styles.statLabel}>Total Teachers</div>
        </div>
        <div style={styles.statCard("#12b886")}>
          <div style={styles.statNum("#12b886")}>{confirmedCount}</div>
          <div style={styles.statLabel}>Confirmed Available</div>
        </div>
        <div style={styles.statCard("#f03e3e")}>
          <div style={styles.statNum("#f03e3e")}>{unconfirmedTeachers.length}</div>
          <div style={styles.statLabel}>Haven't Responded</div>
        </div>
        <div style={styles.statCard("#7950f2")}>
          <div style={styles.statNum("#7950f2")}>{assignedCount}</div>
          <div style={styles.statLabel}>Assigned to Club</div>
        </div>
        <div style={{ ...styles.statCard("#e8590c"), flex: "1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ flex: 1, height: "8px", background: "#f1f3f5", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${totalTeachers ? Math.round((confirmedCount / totalTeachers) * 100) : 0}%`, background: "linear-gradient(90deg, #12b886, #3b5bdb)", borderRadius: "999px", transition: "width 0.4s" }} />
            </div>
            <div style={{ fontWeight: 800, color: "#e8590c", fontSize: "0.95rem" }}>
              {totalTeachers ? Math.round((confirmedCount / totalTeachers) * 100) : 0}%
            </div>
          </div>
          <div style={styles.statLabel}>Response Rate</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Search</label>
          <input
            style={{ ...styles.input, width: "200px" }}
            placeholder="Name, email, dept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Available</label>
          <select style={styles.select} value={filters.available} onChange={(e) => setFilters({ ...filters, available: e.target.value })}>
            <option value="">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Assigned</label>
          <select style={styles.select} value={filters.assigned} onChange={(e) => setFilters({ ...filters, assigned: e.target.value })}>
            <option value="">All</option>
            <option value="Yes">Assigned</option>
            <option value="No">Unassigned</option>
          </select>
        </div>
        <button style={styles.btn("ghost")} onClick={() => { setFilters({ available: "", assigned: "" }); setSearch(""); }}>Clear</button>
        <div style={styles.spacer} />
        <div style={{ fontSize: "0.8rem", color: "#8390a2", fontWeight: 600 }}>
          Showing {filteredTeachers.length} of {totalTeachers} teachers
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Available?", "Name", "Email", "Rm #", "Status", "Department", "Assigned Club", "Actions"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ ...styles.td, textAlign: "center", color: "#8390a2", padding: "2.5rem" }}>
                  No teachers match your filters.
                </td>
              </tr>
            ) : filteredTeachers.map((teacher, i) => {
              const canEdit = isTeacher && teacher.email === currentUserEmail;
              return (
                <tr key={teacher.id || i}>
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={teacher.availableBool}
                      onChange={() => handleAvailabilityCheckbox(teacher)}
                      disabled={!canEdit}
                      style={styles.checkbox(canEdit)}
                      title={canEdit ? "Click to confirm your availability" : "You can only confirm your own availability"}
                    />
                  </td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: teacher.availableBool ? "#d3f9d8" : "#fff0f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: teacher.availableBool ? "#2f9e44" : "#e03131", flexShrink: 0 }}>
                        {teacher.name?.charAt(0) || "?"}
                      </div>
                      {teacher.name}
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: "#555" }}>{teacher.email}</td>
                  <td style={styles.td}>{teacher.room || "—"}</td>
                  <td style={styles.td}>
                    <span style={styles.availBadge(teacher.availableBool)}>
                      {teacher.availableBool ? "✓ Yes" : "✗ No"}
                    </span>
                  </td>
                  <td style={styles.td}>{teacher.department || "—"}</td>
                  <td style={styles.td}>
                    {teacher.availableClubs?.length > 0 ? (
                      <select
                        value={teacher.assigned || "Unassigned"}
                        onChange={(e) => handleAssignedClubChange(teacher, e.target.value)}
                        style={styles.select}
                      >
                        <option value="Unassigned">Unassigned</option>
                        {teacher.availableClubs.map((club, idx) => (
                          <option key={idx} value={club}>{club}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={styles.assignBadge(!!teacher.assigned)}>
                        {teacher.assigned || "Unassigned"}
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        style={{ ...styles.btn("ghost"), padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                        onClick={() => { setSelectedTeacher(teacher); setIsModalOpen(true); }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        style={{ ...styles.btn(teacher.source === "google_form" ? "disabled" : "danger"), padding: "0.35rem 0.6rem", fontSize: "0.78rem" }}
                        onClick={() => handleDeleteTeacher(teacher)}
                        disabled={teacher.source === "google_form"}
                        title={teacher.source === "google_form" ? "Managed via Google Forms" : "Delete teacher"}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showBulkImport && (
        <BulkImportModal onClose={() => setShowBulkImport(false)} onImport={handleBulkImport} />
      )}
      {showEmailModal && (
        <EmailModal
          unconfirmedTeachers={unconfirmedTeachers}
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendEmails}
        />
      )}
      {selectedTeacher && (
        <TeacherModal
          teacher={selectedTeacher}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedTeacher(null); }}
          onSave={handleSave}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}