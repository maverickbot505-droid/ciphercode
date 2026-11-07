'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

type Project = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  tags: string[];
  price: number;
  demoUrl?: string | null;
  screenshots: string[];
  status: 'Published' | 'Hidden' | 'Draft' | 'SoldOut';
};

export default function Catalog() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/projects/catalog', {
          params: { search, category, sort },
        });
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, category, sort]);

  const categories = ['All', 'ecommerce', 'portfolio', 'cms', 'business', 'productivity', 'marketing'];

  return (
    <>
      <main className="min-h-screen bg-cipher-bg">
        {/* Hero */}
        <section className="py-20 px-6 border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="hero-text font-bold tracking-tight sm:text-7xl mb-4">Browse Scripts</h1>
            <p className="text-xl text-cipher-text-muted max-w-2xl mx-auto">
              Discover production-ready web applications for every use case.
            </p>

            {/* Search and Filters */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center items-center max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-64 px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all cursor-pointer"
              >
                <option value="new">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === 'All' ? '' : cat.toLowerCase())}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    category === cat.toLowerCase() || (cat === 'All' && !category)
                      ? 'bg-cipher-primary text-white'
                      : 'bg-cipher-card text-cipher-text-muted hover:bg-gray-700/50 border border-gray-600/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center text-cipher-text-muted py-20">Loading projects...</div>
            ) : (
              <>
                <p className="text-center text-cipher-text-muted mb-8">
                  Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
                </p>

                <div className="project-grid">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>

                {projects.length === 0 && (
                  <div className="text-center text-cipher-text-muted py-20">
                    No projects found. Try adjusting your search filters.
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-cipher-bg/80 border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto text-center text-cipher-text-muted text-sm">
            <p>© {new Date().getFullYear()} CipherCode. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}

// Component: Project Card
function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/project/${project.slug}`} className="card hover:border-cipher-primary transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg group-hover:text-cipher-primary transition-colors">{project.title}</h3>
        {project.featured && (
          <span className="px-2 py-1 rounded-full bg-cipher-primary/20 text-cipher-primary text-xs font-medium">Featured</span>
        )}
      </div>

      <p className="text-sm text-cipher-text-muted mb-4 line-clamp-2">
        {project.description || 'Ready-to-use web application with comprehensive documentation.'}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.slice(0, 3).map((tag: string) => (
          <span key={tag} className="px-2 py-1 rounded-full bg-cipher-bg text-xs text-cipher-text-muted border border-gray-700/50">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-600/50">
        <span className="text-lg font-bold">${project.price.toFixed(2)}</span>
        <span className="px-3 py-1 rounded-full bg-cipher-success/20 text-cipher-success text-sm font-medium">
          {project.status}
        </span>
      </div>
    </Link>
  );
}
