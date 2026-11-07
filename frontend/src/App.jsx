import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import {
  ArrowDown, ArrowDownToLine, ArrowLeft, ArrowUpRight, Award, BriefcaseBusiness,
  Check, CheckCircle2, ChevronRight, Code2, ExternalLink, FileText, Github,
  GraduationCap, Linkedin, LoaderCircle, LockKeyhole, Mail, MapPin, Menu,
  MessageSquare, Pencil, Send, Sparkles, Terminal, Trash2, UserRound, X
} from "lucide-react";
import { api } from "./api";

const emptyPortfolio = {
  profile: { fullName: "Your Name", headline: "Your professional headline", location: "Your City, Country", email: "you@example.com", phone: "", summary: "", availability: "Open to opportunities", linkedin: "", github: "", website: "", resumeUrl: "", photoUrl: "" },
  skills: [], experience: [], projects: [], achievements: [], education: [], certifications: []
};

function initials(name = "Your Name") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "YN";
}

function SectionHeading({ eyebrow, title, note }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{note && <p>{note}</p>}</div>;
}

function PublicPortfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", subject: "Recruitment enquiry", message: "", website: "" });
  const [contactState, setContactState] = useState({ loading: false, message: "", error: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api("/api/portfolio")
      .then(setPortfolio)
      .catch((error) => setLoadError(error.message));
  }, []);

  const p = portfolio || emptyPortfolio;
  const profile = p.profile || emptyPortfolio.profile;
  const projectCount = (p.projects || []).length;
  const experienceCount = (p.experience || []).length;
  const achievementCount = (p.achievements || []).length;

  const submitContact = async (event) => {
    event.preventDefault();
    setContactState({ loading: true, message: "", error: "" });
    try {
      const result = await api("/api/contact", { method: "POST", body: JSON.stringify(contact) });
      setContactState({ loading: false, message: result.message, error: "" });
      setContact({ name: "", email: "", subject: "Recruitment enquiry", message: "", website: "" });
    } catch (error) {
      setContactState({ loading: false, message: "", error: error.message });
    }
  };

  const socialLinks = [
    profile.linkedin && { label: "LinkedIn", href: profile.linkedin, icon: Linkedin },
    profile.github && { label: "GitHub", href: profile.github, icon: Github },
    profile.website && { label: "Website", href: profile.website, icon: ExternalLink }
  ].filter(Boolean);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" onClick={() => setMenuOpen(false)}><span className="brand-mark">H</span><span>hirefolio<span className="brand-dot">.</span></span></a>
        <button className="mobile-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {[ ["About", "about"], ["Experience", "experience"], ["Projects", "projects"], ["Achievements", "achievements"] ].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Contact <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      {loadError && <div className="load-alert"><strong>Could not load portfolio data.</strong> {loadError} Make sure the backend and MongoDB are running.</div>}

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="availability"><span className="status-pulse" />{profile.availability || "Open to opportunities"}</div>
            <p className="hero-kicker">HELLO, I'M</p>
            <h1>{profile.fullName || "Your Name"}<span className="hero-period">.</span></h1>
            <h2>{profile.headline || "Your professional headline"}</h2>
            <p className="hero-summary">{profile.summary || "Add a short professional introduction from your admin dashboard. Tell recruiters what you do, what you are good at and what kind of opportunity you are looking for."}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore my work <ArrowUpRight size={17} /></a>
              <button className="button button-secondary" onClick={() => window.print()}><ArrowDownToLine size={17} /> Save as PDF</button>
            </div>
            <div className="hero-meta">
              {profile.location && <span><MapPin size={15} />{profile.location}</span>}
              {profile.email && <a href={`mailto:${profile.email}`}><Mail size={15} />{profile.email}</a>}
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="profile-card">
              <div className="profile-card-top"><span>PERSONAL PROFILE</span><Sparkles size={17} /></div>
              {profile.photoUrl ? <img className="avatar-image" src={profile.photoUrl} alt={profile.fullName} /> : <div className="avatar-placeholder">{initials(profile.fullName)}</div>}
              <h3>{profile.fullName || "Your Name"}</h3>
              <p>{profile.headline || "Professional title"}</p>
              <div className="card-divider" />
              <div className="profile-mini-stats">
                <div><strong>{projectCount.toString().padStart(2, "0")}</strong><span>Projects</span></div>
                <div><strong>{experienceCount.toString().padStart(2, "0")}</strong><span>Roles</span></div>
                <div><strong>{achievementCount.toString().padStart(2, "0")}</strong><span>Awards</span></div>
              </div>
              {socialLinks.length > 0 && <div className="profile-socials">{socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon size={17} /></a>)}</div>}
            </div>
            <div className="floating-note note-code"><Code2 size={16} /> Build · Learn · Improve</div>
            <div className="floating-note note-check"><CheckCircle2 size={16} /> Results driven</div>
          </div>
          <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></a>
        </section>

        <section className="content-section about-section" id="about">
          <div className="section-wrap two-column">
            <SectionHeading eyebrow="01 / INTRODUCTION" title="A little about me." note="A quick overview for the person behind the work." />
            <div className="about-copy"><p>{profile.summary || "Your professional summary will appear here. Use the admin dashboard to add your background, strengths and career direction."}</p><div className="quick-facts"><div><span>BASED IN</span><strong>{profile.location || "Add your location"}</strong></div><div><span>CAREER STATUS</span><strong>{profile.availability || "Open to opportunities"}</strong></div></div><a className="text-link" href="#contact">Let's start a conversation <ArrowUpRight size={16} /></a></div>
          </div>
        </section>

        <section className="content-section skills-section" id="skills">
          <div className="section-wrap"><SectionHeading eyebrow="02 / TOOLKIT" title="Skills & strengths." note="Technologies, tools and capabilities I bring to the table." />
            {p.skills?.length ? <div className="skill-grid">{p.skills.map((group, index) => <article className="skill-card" key={`${group.category}-${index}`}><div className="skill-card-icon"><Code2 size={19} /></div><h3>{group.category}</h3><div className="tag-list">{(group.items || []).map((item) => <span className="tag" key={item}>{item}</span>)}</div></article>)}</div> : <div className="empty-inline"><Code2 size={19} /><span>Skills will appear here once the profile is completed.</span></div>}
          </div>
        </section>

        <section className="content-section experience-section" id="experience">
          <div className="section-wrap"><SectionHeading eyebrow="03 / CAREER JOURNEY" title="Experience." note="The teams, responsibilities and outcomes that have shaped my work." />
            {p.experience?.length ? <div className="timeline">{p.experience.map((item, index) => <article className="timeline-item" key={`${item.company}-${index}`}><div className="timeline-marker"><BriefcaseBusiness size={17} /></div><div className="timeline-content"><div className="timeline-top"><div><h3>{item.role}</h3><p className="company-line">{item.company}{item.location ? ` · ${item.location}` : ""}</p></div><span className="date-pill">{item.startDate || ""} — {item.current ? "Present" : item.endDate || ""}</span></div>{item.summary && <p className="body-copy">{item.summary}</p>}{item.highlights?.length > 0 && <ul className="detail-list">{item.highlights.map((point, i) => <li key={i}>{point}</li>)}</ul>}</div></article>)}</div> : <div className="empty-inline"><BriefcaseBusiness size={19} /><span>Professional experience will appear here when added to the profile.</span></div>}
          </div>
        </section>

        <section className="content-section projects-section" id="projects">
          <div className="section-wrap"><SectionHeading eyebrow="04 / SELECTED WORK" title="Projects that make an impact." note="A selection of work, experiments and solutions I've contributed to." />
            {p.projects?.length ? <div className="project-grid">{p.projects.map((project, index) => <article className="project-card" key={`${project.title}-${index}`}><div className={`project-art art-${index % 4}`}><span className="project-index">0{index + 1}</span><div className="project-art-icon"><Terminal size={34} /></div>{project.featured && <span className="featured-label">FEATURED</span>}</div><div className="project-card-body"><div className="project-role">{project.role || "PROJECT"}</div><h3>{project.title}</h3><p>{project.description}</p>{project.highlights?.length > 0 && <ul className="detail-list compact">{project.highlights.slice(0, 3).map((point, i) => <li key={i}>{point}</li>)}</ul>}<div className="tag-list project-tags">{(project.techStack || []).map((tech) => <span className="tag" key={tech}>{tech}</span>)}</div><div className="project-links">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={15} /></a>}{project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer">Source code <Github size={15} /></a>}</div></div></article>)}</div> : <div className="empty-feature"><div className="empty-feature-icon"><Code2 size={24} /></div><h3>Good work deserves to be seen.</h3><p>Projects will show here with their goals, your contribution, technologies and links.</p></div>}
          </div>
        </section>

        <section className="content-section achievements-section" id="achievements">
          <div className="section-wrap two-column"><SectionHeading eyebrow="05 / RECOGNITION" title="Achievements & recognition." note="Milestones, awards and moments worth highlighting." />
            <div className="achievement-list">{p.achievements?.length ? p.achievements.map((item, index) => <article className="achievement-item" key={`${item.title}-${index}`}><div className="achievement-icon"><Award size={19} /></div><div><h3>{item.title}</h3><p>{item.issuer}{item.date ? ` · ${item.date}` : ""}</p>{item.description && <span>{item.description}</span>}</div></article>) : <div className="empty-inline"><Award size={19} /><span>Certifications, awards and achievements will appear here.</span></div>}</div>
          </div>
        </section>

        {(p.education?.length > 0 || p.certifications?.length > 0) && <section className="content-section education-section" id="education"><div className="section-wrap"><SectionHeading eyebrow="06 / LEARNING" title="Education & certifications." /><div className="education-grid">{p.education?.map((item, index) => <article className="education-card" key={index}><GraduationCap size={20} /><h3>{item.degree}</h3><p>{item.institution}</p><span>{item.year}</span>{item.details && <small>{item.details}</small>}</article>)}{p.certifications?.map((item, index) => <article className="education-card" key={`cert-${index}`}><Award size={20} /><h3>{item.name}</h3><p>{item.issuer}</p><span>{item.date}</span>{item.url && <a href={item.url} target="_blank" rel="noreferrer">View credential <ExternalLink size={13} /></a>}</article>)}</div></div></section>}

        <section className="contact-section" id="contact"><div className="section-wrap contact-layout"><div className="contact-copy"><span className="eyebrow">07 / GET IN TOUCH</span><h2>Have a role in mind?<br /><em>Let's talk.</em></h2><p>For hiring opportunities, project discussions or a quick introduction, send a message. I'd be glad to connect.</p><div className="contact-direct"><Mail size={18} /><a href={`mailto:${profile.email}`}>{profile.email || "you@example.com"}</a></div>{profile.phone && <div className="contact-direct"><MessageSquare size={18} /><a href={`tel:${profile.phone}`}>{profile.phone}</a></div>}</div>
          <form className="contact-form" onSubmit={submitContact}><div className="form-title"><span>CONTACT FORM</span><Send size={18} /></div><label>Your name<input required maxLength="100" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Name" /></label><label>Email address<input required type="email" maxLength="160" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@company.com" /></label><label>Subject<input maxLength="160" value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })} placeholder="Recruitment enquiry" /></label><label>Message<textarea required minLength="10" maxLength="3000" rows="4" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="Tell me a little about the opportunity..." /></label><input className="honeypot" tabIndex="-1" autoComplete="off" aria-hidden="true" value={contact.website} onChange={(e) => setContact({ ...contact, website: e.target.value })} /><button className="button button-light" disabled={contactState.loading}>{contactState.loading ? <LoaderCircle className="spin" size={17} /> : <Send size={16} />} Send message</button>{contactState.message && <p className="form-success"><CheckCircle2 size={16} />{contactState.message}</p>}{contactState.error && <p className="form-error">{contactState.error}</p>}</form></div></section>
      </main>
      <footer className="site-footer"><a className="brand footer-brand" href="#top"><span className="brand-mark">H</span><span>hirefolio<span className="brand-dot">.</span></span></a><span>Designed to make good work easy to discover.</span><Link to="/admin" className="admin-link">Admin access <LockKeyhole size={13} /></Link></footer>
    </div>
  );
}

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ loading: false, error: "" });

  useEffect(() => {
    if (localStorage.getItem("hirefolio_admin_token")) navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: "" });
    try {
      const result = await api("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      localStorage.setItem("hirefolio_admin_token", result.token);
      navigate("/admin/dashboard");
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  };

  return <div className="admin-page"><div className="admin-login-card"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to public portfolio</Link><div className="admin-lock-icon"><LockKeyhole size={24} /></div><span className="eyebrow">PRIVATE WORKSPACE</span><h1>Admin sign in</h1><p>Sign in to update the portfolio and review recruiter enquiries.</p><form onSubmit={submit}><label>Admin email<input type="email" required autoComplete="username" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@example.com" /></label><label>Password<input type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your admin password" /></label><button className="button button-primary full-width" disabled={state.loading}>{state.loading ? <LoaderCircle className="spin" size={17} /> : <LockKeyhole size={16} />} Sign in</button>{state.error && <p className="form-error">{state.error}</p>}</form><div className="security-note">This area is private. Recruiters can only see the public portfolio.</div></div></div>;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [jsonText, setJsonText] = useState("");
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState("portfolio");
  const [state, setState] = useState({ loading: true, saving: false, error: "", notice: "" });

  const logout = () => {
    localStorage.removeItem("hirefolio_admin_token");
    navigate("/admin");
  };

  const load = async () => {
    setState({ loading: true, saving: false, error: "", notice: "" });
    try {
      const [data, messageData] = await Promise.all([api("/api/admin/portfolio"), api("/api/admin/messages")]);
      setPortfolio(data);
      setJsonText(JSON.stringify(data, null, 2));
      setMessages(messageData.messages || []);
      setState({ loading: false, saving: false, error: "", notice: "" });
    } catch (error) {
      setState({ loading: false, saving: false, error: error.message, notice: "" });
      if (/session|authentication|token/i.test(error.message)) logout();
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setState({ loading: false, saving: true, error: "", notice: "" });
    try {
      const parsed = JSON.parse(jsonText);
      const result = await api("/api/admin/portfolio", { method: "PUT", body: JSON.stringify(parsed) });
      setPortfolio(result.portfolio);
      setJsonText(JSON.stringify(result.portfolio, null, 2));
      setState({ loading: false, saving: false, error: "", notice: "Portfolio saved. Refresh the public page to see your changes." });
    } catch (error) {
      setState({ loading: false, saving: false, error: error instanceof SyntaxError ? "The JSON has a syntax error. Check commas, quotes and brackets." : error.message, notice: "" });
    }
  };

  const markRead = async (id) => {
    try {
      await api(`/api/admin/messages/${id}/read`, { method: "PATCH" });
      setMessages((items) => items.map((item) => item._id === id ? { ...item, isRead: true } : item));
    } catch (error) { setState((current) => ({ ...current, error: error.message })); }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await api(`/api/admin/messages/${id}`, { method: "DELETE" });
      setMessages((items) => items.filter((item) => item._id !== id));
    } catch (error) { setState((current) => ({ ...current, error: error.message })); }
  };

  if (state.loading) return <div className="admin-loading"><LoaderCircle className="spin" /> Loading your workspace...</div>;

  return <div className="admin-page dashboard-page"><header className="dashboard-header"><Link to="/" className="brand"><span className="brand-mark">H</span><span>hirefolio<span className="brand-dot">.</span></span></Link><div className="dashboard-header-actions"><a href="/" target="_blank" rel="noreferrer" className="text-link">View public site <ExternalLink size={15} /></a><button className="button button-secondary small-button" onClick={logout}>Sign out</button></div></header><main className="dashboard-main"><div className="dashboard-welcome"><div><span className="eyebrow">PORTFOLIO MANAGEMENT</span><h1>Your workspace.</h1><p>Keep your professional story current and easy for recruiters to explore.</p></div><div className="workspace-avatar"><Pencil size={22} /></div></div>
    <div className="dashboard-tabs"><button className={tab === "portfolio" ? "active" : ""} onClick={() => setTab("portfolio")}><FileText size={16} /> Portfolio content</button><button className={tab === "messages" ? "active" : ""} onClick={() => setTab("messages")}><MessageSquare size={16} /> Enquiries <span className="tab-count">{messages.filter((item) => !item.isRead).length}</span></button></div>
    {state.error && <div className="admin-alert error-alert">{state.error}</div>}{state.notice && <div className="admin-alert success-alert"><CheckCircle2 size={17} />{state.notice}</div>}
    {tab === "portfolio" ? <div className="editor-layout"><section className="editor-panel"><div className="editor-heading"><div><h2>Edit portfolio data</h2><p>Update the JSON below, then save. The public page reads the saved data from MongoDB.</p></div><span className="saved-indicator"><span /> Connected</span></div><textarea className="json-editor" spellCheck="false" value={jsonText} onChange={(e) => setJsonText(e.target.value)} aria-label="Portfolio JSON editor" /><div className="editor-actions"><span>Tip: Keep property names and JSON quotes intact.</span><button className="button button-primary" onClick={save} disabled={state.saving}>{state.saving ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />} Save portfolio</button></div></section><aside className="editor-help"><div className="help-icon"><Sparkles size={19} /></div><h3>What can you edit?</h3><ul><li><strong>profile</strong> — name, title, summary, location and links</li><li><strong>skills</strong> — skill groups and technologies</li><li><strong>experience</strong> — roles, companies and highlights</li><li><strong>projects</strong> — descriptions, tech stack and links</li><li><strong>achievements</strong> — awards and recognition</li><li><strong>education</strong> and <strong>certifications</strong></li></ul><a className="text-link" href="/" target="_blank" rel="noreferrer">Preview public page <ArrowUpRight size={15} /></a></aside></div> : <section className="messages-panel"><div className="editor-heading"><div><h2>Recruiter enquiries</h2><p>Messages sent through the public contact form.</p></div><span className="message-total">{messages.length} total</span></div>{messages.length ? <div className="message-list">{messages.map((item) => <article className={`message-card ${item.isRead ? "read" : "unread"}`} key={item._id}><div className="message-card-top"><div><h3>{item.subject || "Recruitment enquiry"}</h3><p>{item.name} · <a href={`mailto:${item.email}`}>{item.email}</a></p></div><span className="message-date">{new Date(item.createdAt).toLocaleString()}</span></div><p className="message-body">{item.message}</p><div className="message-actions">{!item.isRead && <button className="text-button" onClick={() => markRead(item._id)}><Check size={15} /> Mark read</button>}<button className="text-button danger-text" onClick={() => deleteMessage(item._id)}><Trash2 size={15} /> Delete</button></div></article>)}</div> : <div className="empty-feature"><div className="empty-feature-icon"><Mail size={24} /></div><h3>No enquiries yet</h3><p>Recruiter messages sent from the public website will appear here.</p></div>}</section>}
    </main></div>;
}

export default function App() {
  return <Routes><Route path="/" element={<PublicPortfolio />} /><Route path="/admin" element={<AdminLogin />} /><Route path="/admin/dashboard" element={<AdminDashboard />} /><Route path="*" element={<PublicPortfolio />} /></Routes>;
}
