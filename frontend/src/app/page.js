'use client';

import { useState, useEffect } from 'react';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-midnight/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-lg font-bold text-white tracking-tight">Portfolio</span>
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
      </div>
    </nav>
  );
}

function Hero({ data }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 shadow-lg shadow-accent/5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Available for projects
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          {data?.name}
        </h1>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
          {data?.tagline}
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="#projects"
            className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 hover:shadow-accent/30"
          >
            View Projects
          </a>
          <a
            href="#about"
            className="px-6 py-3 rounded-xl bg-midnight-light text-slate-200 font-medium border border-white/10 hover:border-white/20 transition-all hover:shadow-xl hover:shadow-white/5"
          >
            About Me
          </a>
        </div>
      </div>
    </section>
  );
}

function Skills({ skills }) {
  const iconMap = {
    Laravel: 'L',
    'Next.js': 'N',
    'Tailwind CSS': 'T',
    React: 'R',
    PHP: 'P',
  };

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Skills & Technologies</h2>
          <p className="text-slate-400">Technologies I work with on a daily basis</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {skills?.map((skill) => (
            <div
              key={skill}
              className="group p-6 rounded-2xl bg-midnight-light/50 border border-white/5 hover:border-accent/20 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg mb-3 group-hover:bg-accent/20 transition-colors">
                {iconMap[skill] || skill[0]}
              </div>
              <p className="text-white font-medium text-sm">{skill}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ projects }) {
  return (
    <section id="projects" className="py-24 px-6 bg-midnight-light/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-slate-400">Some of my recent work</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {projects?.map((project) => (
            <div
              key={project.title}
              className="group p-6 rounded-2xl bg-midnight-light/60 border border-white/5 hover:border-accent/20 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1"
            >
              <div className="w-full h-40 rounded-xl bg-gradient-to-br from-accent/10 to-purple-500/10 mb-5 flex items-center justify-center border border-white/5 group-hover:border-accent/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{project.description}</p>
              {project.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About({ about }) {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
        <div className="p-8 rounded-2xl bg-midnight-light/50 border border-white/5 shadow-xl shadow-black/20">
          <p className="text-slate-300 leading-relaxed mb-6">{about?.bio}</p>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{about?.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>&copy; {year} Portfolio. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">GitHub</a>
          <a href="#" className="hover:text-slate-300 transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [portfolio, setPortfolio] = useState(null);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setError('NEXT_PUBLIC_API_URL not set in .env.local');
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${apiUrl}/portfolio`).then((r) => r.json()),
      fetch(`${apiUrl}/portfolio/about`).then((r) => r.json()),
    ])
      .then(([portfolioRes, aboutRes]) => {
        setPortfolio(portfolioRes.data);
        setAbout(aboutRes.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <div className="p-4 rounded-xl bg-midnight-light/50 border border-white/5 text-left">
            <p className="text-slate-500 text-xs font-mono mb-2">Make sure Laravel is running:</p>
            <code className="text-accent text-sm font-mono">cd backend && php artisan serve --port=8000</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-midnight min-h-screen">
      <Navbar />
      <Hero data={portfolio} />
      <Skills skills={portfolio?.skills} />
      <Projects projects={portfolio?.projects} />
      <About about={about} />
      <Footer />
    </div>
  );
}
