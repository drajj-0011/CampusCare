import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, AlertCircle, ArrowDownUp, CheckCircle2, ChevronDown, ClipboardList,
  Clock3, Filter, Hammer, LayoutDashboard, MapPin, Plus, Search, ShieldCheck,
  Trash2, Wrench, X
} from "lucide-react";

const API = "http://localhost:5000/api/complaints";
const categories = ["Electrical", "Plumbing", "Cleaning", "Internet", "Furniture", "Other"];
const statuses = ["Pending", "In Progress", "Resolved"];
const blankForm = { title: "", description: "", category: "Electrical", location: "", reporter: "", priority: "Medium" };

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function App() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not load complaints.");
      setComplaints(result.data);
    } catch (err) {
      setError(err.message || "Could not connect to the API. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadComplaints(); }, [loadComplaints]);

  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter((item) => item.status === "Pending").length,
    progress: complaints.filter((item) => item.status === "In Progress").length,
    resolved: complaints.filter((item) => item.status === "Resolved").length
  }), [complaints]);

  const visibleComplaints = useMemo(() => complaints.filter((item) => {
    const text = `${item.title} ${item.location} ${item.reporter}`.toLowerCase();
    return (statusFilter === "All" || item.status === statusFilter)
      && (categoryFilter === "All" || item.category === categoryFilter)
      && text.includes(search.toLowerCase().trim());
  }), [complaints, statusFilter, categoryFilter, search]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submitComplaint(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not submit complaint.");
      setForm(blankForm);
      setShowForm(false);
      setNotice("Your complaint has been submitted.");
      await loadComplaints();
    } catch (err) {
      setError(err.message || "Could not submit complaint.");
    } finally {
      setSaving(false);
    }
  }

  async function updateComplaint(id, changes) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not update complaint.");
      setComplaints((current) => current.map((item) => item._id === id ? result.data : item));
      setNotice("Complaint updated successfully.");
      setError("");
    } catch (err) {
      setError(err.message || "Could not update complaint.");
    }
  }

  async function deleteComplaint(id) {
    if (!window.confirm("Delete this complaint? This action cannot be undone.")) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not delete complaint.");
      setComplaints((current) => current.filter((item) => item._id !== id));
      setNotice("Complaint deleted.");
      setError("");
    } catch (err) {
      setError(err.message || "Could not delete complaint.");
    }
  }

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(id);
  }, [notice]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Wrench size={22} strokeWidth={2.6} /></div>
          <div><strong>CampusCare</strong><span>SMART CAMPUS</span></div>
        </div>
        <div className="side-label">WORKSPACE</div>
        <button className="nav-item active"><LayoutDashboard size={18} /> Overview</button>
        <button className="nav-item" onClick={() => { setStatusFilter("All"); document.getElementById("complaints")?.scrollIntoView({ behavior: "smooth" }); }}><ClipboardList size={18} /> All complaints <span className="nav-count">{stats.total}</span></button>
        <button className="nav-item" onClick={() => { setStatusFilter("Pending"); document.getElementById("complaints")?.scrollIntoView({ behavior: "smooth" }); }}><Clock3 size={18} /> Pending</button>
        <button className="nav-item" onClick={() => { setStatusFilter("Resolved"); document.getElementById("complaints")?.scrollIntoView({ behavior: "smooth" }); }}><CheckCircle2 size={18} /> Resolved</button>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><ShieldCheck size={19} /></div>
            <strong>A better campus starts here.</strong>
            <p>Report an issue. Track the fix. Make a difference.</p>
            <button onClick={() => setShowForm(true)}>Report an issue <Plus size={15} /></button>
          </div>
          <div className="profile"><div className="avatar">CC</div><div><strong>Campus Team</strong><span>Maintenance portal</span></div><ChevronDown size={16} /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div>
          <div className="topbar-right"><span className="live-dot"></span><span>Campus operations</span><div className="top-avatar"><Activity size={17} /></div></div>
        </header>

        <section className="page-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line"></span> CAMPUS OPERATIONS</div>
            <h1>Good day, Campus Team <span>✦</span></h1>
            <p>Keep your campus running smoothly, one fix at a time.</p>
          </div>
          <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} /> New complaint</button>
        </section>

        {error && <div className="alert error-alert"><AlertCircle size={18} /><span>{error}</span><button onClick={() => setError("")}><X size={16} /></button></div>}
        {notice && <div className="alert success-alert"><CheckCircle2 size={18} /><span>{notice}</span><button onClick={() => setNotice("")}><X size={16} /></button></div>}

        <section className="stats-grid">
          <StatCard title="Total complaints" value={stats.total} note="All reported issues" icon={<ClipboardList size={20} />} tone="blue" />
          <StatCard title="Awaiting action" value={stats.pending} note="Needs attention" icon={<Clock3 size={20} />} tone="orange" />
          <StatCard title="In progress" value={stats.progress} note="Being worked on" icon={<Hammer size={20} />} tone="purple" />
          <StatCard title="Resolved" value={stats.resolved} note="Issues fixed" icon={<CheckCircle2 size={20} />} tone="green" />
        </section>

        <section className="insight-banner">
          <div className="banner-icon"><Activity size={22} /></div>
          <div className="banner-copy"><strong>Small fixes make a big difference.</strong><span>Stay on top of campus issues and keep everyone moving.</span></div>
          <div className="banner-progress"><div><span>Resolution progress</span><strong>{stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%</strong></div><div className="progress-track"><span style={{ width: `${stats.total ? (stats.resolved / stats.total) * 100 : 0}%` }}></span></div></div>
        </section>

        <section className="complaints-section" id="complaints">
          <div className="section-heading">
            <div><h2>Recent complaints</h2><p>Review, prioritize, and manage campus issues.</p></div>
            <button className="outline-button" onClick={loadComplaints}><ArrowDownUp size={16} /> Refresh</button>
          </div>
          <div className="filter-bar">
            <div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, location, reporter..." /></div>
            <div className="filter-select"><Filter size={16} /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>
            <div className="filter-select"><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option>All</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>COMPLAINT</th><th>CATEGORY</th><th>LOCATION</th><th>PRIORITY</th><th>STATUS</th><th>REPORTED</th><th></th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="7" className="empty-state"><div className="spinner"></div>Loading complaints...</td></tr>
                : visibleComplaints.length === 0 ? <tr><td colSpan="7" className="empty-state"><div className="empty-icon"><ClipboardList size={22} /></div><strong>No complaints found</strong><span>Try changing the filters or submit a new complaint.</span><button className="small-link" onClick={() => { setSearch(""); setStatusFilter("All"); setCategoryFilter("All"); }}>Clear filters</button></td></tr>
                : visibleComplaints.map((item) => <ComplaintRow key={item._id} item={item} onUpdate={updateComplaint} onDelete={deleteComplaint} />)}
              </tbody>
            </table>
          </div>
          <div className="table-footer"><span>Showing <strong>{visibleComplaints.length}</strong> of <strong>{complaints.length}</strong> complaints</span><span><span className="live-dot"></span> Synced with database</span></div>
        </section>
        <footer className="footer"><span>© 2026 CampusCare <span className="creator-credit">· Built by Debraj</span></span><span>Built for a cleaner, safer, smarter campus <span className="footer-heart">♥</span></span></footer>
      </main>

      {showForm && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-header"><div><div className="eyebrow"><span className="eyebrow-line"></span> HELP IMPROVE YOUR CAMPUS</div><h2 id="modal-title">Report an issue</h2><p>Share a few details so the right team can help.</p></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close"><X size={20} /></button></div>
          <form onSubmit={submitComplaint} className="complaint-form">
            <label>Complaint title<input name="title" value={form.title} onChange={updateField} placeholder="e.g. Projector not working" minLength="4" maxLength="100" required /></label>
            <div className="form-row"><label>Category<select name="category" value={form.category} onChange={updateField}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Priority<select name="priority" value={form.priority} onChange={updateField}><option>Low</option><option>Medium</option><option>High</option></select></label></div>
            <label>Campus location<div className="input-with-icon"><MapPin size={17} /><input name="location" value={form.location} onChange={updateField} placeholder="e.g. Block A, Room 203" maxLength="120" required /></div></label>
            <label>Your name<input name="reporter" value={form.reporter} onChange={updateField} placeholder="Enter your full name" maxLength="80" required /></label>
            <label>Description<textarea name="description" value={form.description} onChange={updateField} placeholder="Describe the issue and when you noticed it..." minLength="10" maxLength="1000" rows="4" required /></label>
            <div className="form-note"><ShieldCheck size={16} /> Your report helps the campus team take action.</div>
            <div className="modal-actions"><button type="button" className="outline-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" disabled={saving}>{saving ? "Submitting..." : <><Plus size={17} /> Submit complaint</>}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

function StatCard({ title, value, note, icon, tone }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-title">{title}</div><div className="stat-value">{value}</div><div className="stat-note"><span className={`note-dot ${tone}`}></span>{note}</div></article>;
}

function ComplaintRow({ item, onUpdate, onDelete }) {
  return <tr>
    <td><div className="complaint-title-cell"><div className={`category-symbol ${item.category.toLowerCase()}`}><Wrench size={16} /></div><div><strong>{item.title}</strong><span>#{item._id.slice(-6).toUpperCase()} · {item.reporter}</span></div></div></td>
    <td><span className="category-label">{item.category}</span></td>
    <td><div className="location-cell"><MapPin size={14} />{item.location}</div></td>
    <td><span className={`priority-pill ${item.priority.toLowerCase()}`}><span></span>{item.priority}</span></td>
    <td><select aria-label={`Status for ${item.title}`} className={`status-select ${item.status.toLowerCase().replace(" ", "-")}`} value={item.status} onChange={(e) => onUpdate(item._id, { status: e.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td>
    <td><span className="date-cell">{formatDate(item.createdAt)}</span></td>
    <td><button className="row-delete" onClick={() => onDelete(item._id)} title="Delete complaint" aria-label={`Delete ${item.title}`}><Trash2 size={16} /></button></td>
  </tr>;
}

export default App;
