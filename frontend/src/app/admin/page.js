'use client';

import { useState, useEffect } from 'react';

function authedFetch(url, options = {}) {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = '/admin/login';
    throw new Error('No token');
  }

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  }).then(async (res) => {
    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }
    return res.json();
  });
}

function ProfileTab() {
  const [form, setForm] = useState({ name: '', tagline: '', bio: '', location: '', email: '', github: '', linkedin: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile`)
      .then((res) => {
        if (res.status === 'success') {
          const d = res.data;
          setForm({ name: d.name || '', tagline: d.tagline || '', bio: d.bio || '', location: d.location || '', email: d.email || '', github: d.github || '', linkedin: d.linkedin || '' });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-slate-500 text-sm animate-pulse">Loading profile...</div>;
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      if (res.status === 'success') {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-cms" /></div>
        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Tagline</label><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="input-cms" /></div>
        <div className="sm:col-span-2"><label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="input-cms resize-none" /></div>
        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-cms" /></div>
        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-cms" /></div>
        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">GitHub</label><input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className="input-cms" /></div>
        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">LinkedIn</label><input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="input-cms" /></div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        {saved && <span className="text-emerald-400 text-sm">Saved!</span>}
      </div>
    </form>
  );
}

function SkillsTab() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/skills`)
      .then((res) => { if (res.status === 'success') setSkills(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function addSkill() {
    if (!newSkill.trim()) return;
    const res = await authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/skills`, {
      method: 'POST',
      body: JSON.stringify({ name: newSkill }),
    });
    if (res.status === 'success') {
      setSkills([...skills, res.data]);
      setNewSkill('');
    }
  }

  async function deleteSkill(id) {
    const res = await authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/skills/${id}`, { method: 'DELETE' });
    if (res.status === 'success') setSkills(skills.filter((s) => s.id !== id));
  }

  if (loading) {
    return <div className="text-slate-500 text-sm animate-pulse">Loading skills...</div>;
  }

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} placeholder="Add a skill..." className="flex-1 input-cms" />
        <button onClick={addSkill} className="btn-primary whitespace-nowrap">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div key={skill.id} className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-midnight-light border border-white/10 text-slate-200 text-sm">
            {skill.name}
            <button onClick={() => deleteSkill(skill.id)} className="text-slate-500 hover:text-red-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        {skills.length === 0 && <p className="text-slate-500 text-sm">No skills yet.</p>}
      </div>
    </div>
  );
}

function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', tagsInput: '' });
  const [loading, setLoading] = useState(true);

  function resetForm() {
    setForm({ title: '', description: '', tagsInput: '' });
    setEditing(null);
    setShowForm(false);
  }

  useEffect(() => {
    authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/projects`)
      .then((res) => { if (res.status === 'success') setProjects(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const tags = form.tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const body = { title: form.title, description: form.description, tags };
    let res;
    if (editing) {
      res = await authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/projects/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      res = await authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/projects`, { method: 'POST', body: JSON.stringify(body) });
    }
    if (res.status === 'success') {
      if (editing) setProjects(projects.map((p) => (p.id === res.data.id ? res.data : p)));
      else setProjects([...projects, res.data]);
      resetForm();
    }
  }

  function editProject(project) {
    setEditing(project);
    setForm({ title: project.title, description: project.description || '', tagsInput: (project.tags || []).join(', ') });
    setShowForm(true);
  }

  async function deleteProject(id) {
    const res = await authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/projects/${id}`, { method: 'DELETE' });
    if (res.status === 'success') setProjects(projects.filter((p) => p.id !== id));
  }

  if (loading) {
    return <div className="text-slate-500 text-sm animate-pulse">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-medium">Projects ({projects.length})</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm">+ New Project</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-midnight-light/50 border border-white/10 mb-6 space-y-4">
          <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-cms" required /></div>
          <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-cms resize-none" /></div>
          <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Tags (comma separated)</label><input value={form.tagsInput} onChange={(e) => setForm({ ...form, tagsInput: e.target.value })} className="input-cms" placeholder="Next.js, Laravel" /></div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="px-5 py-2 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
          </div>
        </form>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="p-5 rounded-2xl bg-midnight-light/50 border border-white/5 hover:border-accent/20 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-medium">{project.title}</h4>
              <div className="flex gap-1">
                <button onClick={() => editProject(project)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                </button>
                <button onClick={() => deleteProject(project.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-3">{project.description}</p>
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">{project.tags.map((tag) => (<span key={tag} className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs">{tag}</span>))}</div>
            )}
          </div>
        ))}
        {projects.length === 0 && <p className="text-slate-500 text-sm sm:col-span-2">No projects yet.</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [state, setState] = useState('loading');
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    } else {
      setState('ready');
    }
  }, []);

  async function handleLogout() {
    try {
      await authedFetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/logout`, { method: 'POST' });
    } catch {}
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { key: 'skills', label: 'Skills', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { key: 'projects', label: 'Projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
  ];

  return (
    <div className="min-h-screen bg-midnight flex">
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-midnight-light border-r border-white/5 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <h1 className="text-lg font-bold text-white">CMS</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/5 bg-midnight/80 backdrop-blur-lg sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
            <h2 className="text-lg font-semibold text-white capitalize">{tabs.find((t) => t.key === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">View Site</a>
            <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-red-400 transition-colors">Logout</button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-midnight-light/30 border border-white/5 shadow-xl shadow-black/20">
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'skills' && <SkillsTab />}
              {activeTab === 'projects' && <ProjectsTab />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
