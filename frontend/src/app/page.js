'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Code2, Globe, Mail, MapPin,
  ExternalLink, FolderKanban, Award, Clock, ChevronDown, Menu, X, Link
} from 'lucide-react';

function GithubIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function LinkedinIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 1.741v6.494z"/>
    </svg>
  );
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}

function Navbar({ profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-midnight/90 backdrop-blur-lg border-b border-white/5' : ''}`}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-lg font-bold text-white tracking-tight">{profile?.name || 'Portfolio'}</span>

        <div className="hidden sm:flex gap-6 text-sm text-slate-400">
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden bg-midnight/95 backdrop-blur-lg border-t border-white/5">
          <div className="px-6 py-4 flex flex-col gap-4 text-sm text-slate-400">
            <a href="#skills" onClick={() => setMobileOpen(false)} className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" onClick={() => setMobileOpen(false)} className="hover:text-white transition-colors">Projects</a>
            <a href="#about" onClick={() => setMobileOpen(false)} className="hover:text-white transition-colors">About</a>
            <a href="#contact" onClick={() => setMobileOpen(false)} className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
}

function FadeIn({ children, delay = 0, direction = 'up' }) {
  const ref = { useRef: () => ({ current: null }) };
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

function Hero({ data }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="text-center max-w-2xl">
        <FadeIn delay={0}>
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-purple-500 p-1">
              <div className="w-full h-full rounded-full bg-midnight-light flex items-center justify-center overflow-hidden">
                {data?.avatar ? (
                  <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">{data?.name?.[0] || '?'}</span>
                )}
              </div>
            </div>
            <span className="absolute bottom-2 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-midnight animate-pulse" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Available for projects
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            {data?.name}
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
            {data?.tagline}
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#projects"
              className="px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 hover:shadow-accent/30 flex items-center justify-center gap-2"
            >
              <FolderKanban size={18} />
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-midnight-light text-slate-200 font-medium border border-white/10 hover:border-white/20 transition-all hover:shadow-xl hover:shadow-white/5 flex items-center justify-center gap-2"
            >
              <Mail size={18} />
              Contact Me
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mt-16 animate-bounce">
            <ChevronDown size={24} className="mx-auto text-slate-500" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function SkillIcon({ skill }) {
  const iconMap = {
    'Laravel': <Code2 size={24} />,
    'Next.js': <Globe size={24} />,
    'Tailwind CSS': <Code2 size={24} />,
    'React': <Code2 size={24} />,
    'PHP': <Code2 size={24} />,
    'Vue': <Code2 size={24} />,
    'Node.js': <Globe size={24} />,
    'Python': <Code2 size={24} />,
    'JavaScript': <Code2 size={24} />,
    'TypeScript': <Code2 size={24} />,
    'MySQL': <Code2 size={24} />,
    'PostgreSQL': <Code2 size={24} />,
    'MongoDB': <Code2 size={24} />,
    'Docker': <Globe size={24} />,
    'AWS': <Globe size={24} />,
    'Git': <Code2 size={24} />,
  };

  return iconMap[skill] || <Code2 size={24} />;
}

function Skills({ skills }) {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Skills & Technologies</h2>
            <p className="text-slate-400">Technologies I work with on a daily basis</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {skills?.map((skill, i) => (
            <FadeIn key={skill} delay={i * 0.05}>
              <div className="group p-5 sm:p-6 rounded-2xl bg-midnight-light/50 border border-white/5 hover:border-accent/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 cursor-default">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3 group-hover:bg-accent/20 group-hover:scale-110 transition-all">
                  <SkillIcon skill={skill} />
                </div>
                <p className="text-white font-medium text-sm">{skill}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <FadeIn delay={index * 0.1}>
      <div className="group relative p-6 rounded-2xl bg-midnight-light/60 border border-white/5 hover:border-accent/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2">
        <div className="w-full h-44 rounded-xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-blue-500/10 mb-5 flex items-center justify-center border border-white/5 group-hover:border-accent/20 transition-colors overflow-hidden">
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <FolderKanban size={28} />
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{project.description}</p>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">{tag}</span>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors"
            >
              <ExternalLink size={14} />
              Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors"
            >
              <GithubIcon size={14} />
              Code
            </a>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

function Projects({ projects }) {
  return (
    <section id="projects" className="py-24 px-6 bg-midnight-light/20">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Featured Projects</h2>
            <p className="text-slate-400">Some of my recent work</p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects?.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCounter({ value, label, icon: Icon }) {
  const [count, setCount] = useState(0);
  const ref = { current: null };
  const isInView = true;

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) return;

    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3">
        <Icon size={24} />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{count}+</p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}

function About({ about }) {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">About Me</h2>
            <p className="text-slate-400">Get to know me better</p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="p-8 rounded-2xl bg-midnight-light/50 border border-white/5 shadow-xl shadow-black/20">
              <p className="text-slate-300 leading-relaxed mb-6">{about?.bio}</p>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={16} />
                <span>{about?.location}</span>
              </div>

              {about?.social_links && (
                <div className="mt-6 flex gap-4">
                  {about.social_links.github && (
                    <a href={about.social_links.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                      <GithubIcon size={18} />
                    </a>
                  )}
                  {about.social_links.linkedin && (
                    <a href={about.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                      <LinkedinIcon size={18} />
                    </a>
                  )}
                  {about.social_links.email && (
                    <a href={`mailto:${about.social_links.email}`} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                      <Mail size={18} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              <StatCounter value="3" label="Years Experience" icon={Clock} />
              <StatCounter value="15" label="Projects Completed" icon={FolderKanban} />
              <StatCounter value="8" label="Happy Clients" icon={Award} />
              <StatCounter value="12" label="Technologies" icon={Code2} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-midnight-light/20">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let&apos;s Work Together</h2>
          <p className="text-slate-400 mb-8">Have a project in mind? Let&apos;s discuss how I can help bring your ideas to life.</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <a
            href="mailto:your.email@example.com"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-white font-semibold text-lg hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1"
          >
            <Mail size={20} />
            Get In Touch
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

function Footer({ profile }) {
  const year = new Date().getFullYear();
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>&copy; {year} {profile?.name || 'Portfolio'}. All rights reserved.</p>
        <div className="flex gap-6">
          {profile?.social_links?.github && (
            <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
              <GithubIcon size={18} />
            </a>
          )}
          {profile?.social_links?.linkedin && (
            <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
              <LinkedinIcon size={18} />
            </a>
          )}
          {profile?.social_links?.email && (
            <a href={`mailto:${profile.social_links.email}`} className="hover:text-slate-300 transition-colors">
              <Mail size={18} />
            </a>
          )}
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
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
      <AnimatedBackground />
      <Navbar profile={portfolio} />
      <Hero data={portfolio} />
      <Skills skills={portfolio?.skills} />
      <Projects projects={portfolio?.projects} />
      <About about={about} />
      <Contact />
      <Footer profile={portfolio} />
    </div>
  );
}