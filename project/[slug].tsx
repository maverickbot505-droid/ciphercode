'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

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
  bundle: string;
  license: string;
  version: string;
  status: 'Published' | 'Hidden' | 'Draft' | 'SoldOut';
};

type Device = 'desktop' | 'tablet' | 'mobile';

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState<'script_only' | 'with_deployment'>('script_only');
  const [device, setDevice] = useState<Device>('desktop');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/projects/${params.slug}`);
        if (response.data.success && response.data.data) {
          setProject(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  if (!project && !loading) {
    return (
      <main className="min-h-screen bg-cipher-bg flex items-center justify-center">
        <div className="text-center text-cipher-text-muted">
          <p className="text-xl mb-4">Project not found</p>
          <Link href="/catalog" className="btn btn-primary">Back to Catalog</Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{project?.title || 'Project'} | CipherCode</title>
      </Head>

      <main className="min-h-screen bg-cipher-bg">
        {/* Header */}
        <section className="py-12 px-6 border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/catalog" className="text-cipher-primary hover:text-blue-400 transition-colors">
                ← Back to Catalog
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{project?.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              {project?.featured && (
                <span className="px-3 py-1 rounded-full bg-cipher-primary/20 text-cipher-primary text-sm font-medium">Featured</span>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project?.status === 'Published' ? 'bg-green-500/20 text-green-400' : ''
              }`}>
                {project?.status}
              </span>
            </div>

            <p className="text-lg text-cipher-text-muted max-w-3xl">{project?.description}</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Left Column: Gallery and Info */}
            <div className="space-y-8">
              {/* Screenshots Gallery */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Screenshots</h3>
                <div className="grid grid-cols-2 gap-4">
                  {project?.screenshots.slice(0, 4).map((src: string) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${project?.title} screenshot`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-600/50"
                    />
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'].map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full bg-cipher-bg text-sm text-cipher-text-muted border border-gray-600/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-cipher-text-muted text-sm">
                  <li>✓ Production-ready codebase</li>
                  <li>✓ Comprehensive documentation</li>
                  <li>✓ SEO-optimized by default</li>
                  <li>✓ Responsive design (mobile-first)</li>
                  <li>✓ Easy customization and extension</li>
                </ul>
              </div>

              {/* What's Included */}
              <div>
                <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                <ul className="space-y-2 text-cipher-text-muted text-sm">
                  <li>✓ Complete source code archive</li>
                  <li>✓ Installation & setup guide</li>
                  <li>✓ Configuration examples</li>
                  <li>✓ License file</li>
                </ul>
              </div>

              {/* License */}
              <div>
                <h3 className="text-xl font-semibold mb-2">License</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project?.license === 'MIT' ? 'bg-green-500/20 text-green-400' : ''
                }`}>
                  {project?.license} License
                </span>
              </div>

              {/* Version */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Version</h3>
                <span className="text-cipher-text-muted">{project?.version}</span>
              </div>

              {/* Demo URL */}
              {project?.demoUrl && (
                <div className="p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50">
                  <p className="text-sm text-cipher-text-muted mb-2">Live Demo</p>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cipher-primary hover:text-blue-400 transition-colors underline"
                  >
                    Open Demo →
                  </a>
                </div>
              )}

              {/* Price and Buy Buttons */}
              <div className="p-6 bg-gradient-to-br from-cipher-card to-cipher-bg/50 rounded-xl border border-gray-700/50">
                <div className="mb-6 text-center">
                  <span className="text-sm text-cipher-text-muted">Starting at</span>
                  <div className="text-4xl font-bold mt-2">${project?.price?.toFixed(2)}</div>
                </div>

                <div className="space-y-3">
                  <Link href="/order" className="btn btn-primary w-full">
                    Buy Script Only
                  </Link>
                  <button className="btn btn-secondary w-full">
                    Buy + Deploy Service
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Form (Hidden for now) */}
            <div className="hidden lg:block">
              <OrderForm project={project!} />
            </div>
          </div>
        </section>

        {/* Mobile CTA */}
        <section className="py-12 px-6 bg-gradient-to-br from-cipher-card to-cipher-bg/50 border-t border-gray-700/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <Link href="/order" className="btn btn-primary inline-block">
              Start Your Order →
            </Link>
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

// Component: Order Form (hidden until needed)
function OrderForm({ project }: { project: any }) {
  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6">Place Your Order</h3>

      {/* Order Type Selection */}
      <div className="space-y-4 mb-8">
        <label className="flex items-center gap-4 p-4 border border-gray-700/50 rounded-lg hover:bg-cipher-bg/30 cursor-pointer transition-colors">
          <input
            type="radio"
            name="orderType"
            checked={orderType === 'script_only'}
            onChange={() => setOrderType('script_only')}
            className="text-cipher-primary focus:ring-cipher-primary"
          />
          <div className="flex-1">
            <p className="font-medium">Script Only</p>
            <p className="text-sm text-cipher-text-muted">Receive source code archive immediately after payment</p>
          </div>
        </label>

        <label className="flex items-center gap-4 p-4 border border-gray-700/50 rounded-lg hover:bg-cipher-bg/30 cursor-pointer transition-colors">
          <input
            type="radio"
            name="orderType"
            checked={orderType === 'with_deployment'}
            onChange={() => setOrderType('with_deployment')}
            className="text-cipher-primary focus:ring-cipher-primary"
          />
          <div className="flex-1">
            <p className="font-medium">Script + Deployment</p>
            <p className="text-sm text-cipher-text-muted">We deploy your application to our infrastructure with optional subdomain</p>
          </div>
        </label>
      </div>

      {/* Deployment Settings */}
      {orderType === 'with_deployment' && (
        <div className="space-y-4 p-4 bg-cipher-bg/50 rounded-lg border border-gray-700/50">
          <h4 className="font-semibold mb-3">Deployment Preferences</h4>
          
          <div>
            <label className="block text-sm font-medium mb-1">Subdomain (optional)</label>
            <input
              type="text"
              placeholder="app.yourbrand.com"
              className="w-full px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Custom Domain (optional)</label>
            <input
              type="text"
              placeholder="www.yourbrand.com"
              className="w-full px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Region</label>
            <select className="w-full px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all cursor-pointer">
              <option value="">Auto-select</option>
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="eu-west-1">EU West (Ireland)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Environment Variables</label>
            <textarea
              placeholder="KEY=VALUE&#n;API_KEY=secret123"
              rows={4}
              className="w-full px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea
              placeholder="Any special requirements..."
              rows={3}
              className="w-full px-4 py-3 bg-cipher-card border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all"
            />
          </div>
        </div>
      )}

      {/* Continue to Checkout */}
      <Link href="/order?project={project.slug}&type={orderType}" className="btn btn-primary w-full">
        Continue to Checkout →
      </Link>

      <p className="text-xs text-cipher-text-muted mt-4 text-center">
        All payments are crypto-only. No credit cards or bank transfers accepted.
      </p>
    </div>
  );
}
