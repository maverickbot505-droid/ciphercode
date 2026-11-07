'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';

type Project = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category?: string | null;
  tags: string[];
  price: number;
  demoUrl?: string | null;
  screenshots: string[];
  status: 'Published' | 'Hidden' | 'Draft' | 'SoldOut';
  featured: boolean;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/projects/catalog');
        setProjects(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>CipherCode - Ready-made Webapp Scripts</title>
        <meta name="description" content="Download production-ready web application scripts or deploy instantly with our service. Crypto payments only." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-cipher-bg">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-text font-bold tracking-tight sm:text-7xl text-white mb-6">
              CipherCode
            </h1>
            
            <p className="text-xl text-cipher-text-muted mb-8 max-w-2xl mx-auto fade-in slide-up" style={{animationDelay: '0.1s'}}>
              Instant access to production-ready web applications. Choose, pay with crypto, and receive your code instantly.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12 fade-in slide-up" style={{animationDelay: '0.2s'}}>
              {projects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.slug}`}
                  className="px-6 py-3 bg-cipher-card border border-gray-700/50 rounded-lg hover:border-cipher-primary hover:text-cipher-primary transition-all text-center"
                >
                  {project.title}
                </Link>
              ))}
            </div>

            {/* How It Works */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              <HowItWorksStep
                number="1"
                title="Choose"
                description="Browse our catalog of production-ready webapp scripts. Find the perfect solution for your needs."
              />
              <HowItWorksStep
                number="2"
                title="Order"
                description="Enter your alias and email. Select script only or with deployment service."
              />
              <HowItWorksStep
                number="3"
                title="Pay"
                description="Choose your cryptocurrency, send payment, and receive instant confirmation."
              />
              <HowItWorksStep
                number="4"
                title="Receive"
                description="Get access to source code immediately. Deploy on your infrastructure or let us handle it."
              />
            </div>

            {/* CTA */}
            <Link
              href="/catalog"
              className="inline-block mt-12 px-8 py-4 bg-gradient-to-r from-cipher-primary to-cipher-secondary text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/30 transition-all fade-in slide-up"
              style={{animationDelay: '0.3s'}}
            >
              Browse All Scripts →
            </Link>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 px-6 bg-cipher-bg/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>

            {loading ? (
              <div className="text-center text-cipher-text-muted">Loading projects...</div>
            ) : (
              <div className="project-grid">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-8">
              {faqData.map((item) => (
                <FAQItem key={item.id} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-cipher-card to-cipher-bg/50">
          <div className="max-w-4xl mx-auto text-center card p-12">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-cipher-text-muted mb-8 max-w-2xl mx-auto">
              Join hundreds of developers who trust CipherCode for their webapp scripts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/catalog" className="btn btn-primary">
                Browse Catalog
              </Link>
              <Link href="/about" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-cipher-bg/80">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4">CipherCode</h3>
                <p className="text-cipher-text-muted text-sm">
                  Ready-made webapp scripts and deployment services. Crypto payments only.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Products</h4>
                <ul className="space-y-2 text-cipher-text-muted text-sm">
                  <li><Link href="/catalog" className="hover:text-cipher-primary transition-colors">All Scripts</Link></li>
                  <li><Link href="/deployment" className="hover:text-cipher-primary transition-colors">Deployment Service</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-cipher-text-muted text-sm">
                  <li><a href="/docs/getting-started" className="hover:text-cipher-primary transition-colors">Documentation</a></li>
                  <li><Link href="/faq" className="hover:text-cipher-primary transition-colors">FAQ</Link></li>
                  <li><a href="mailto:support@ciphercode.app" className="hover:text-cipher-primary transition-colors">Contact Us</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-cipher-text-muted text-sm">
                  <li><Link href="/terms" className="hover:text-cipher-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-cipher-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/acceptable-use" className="hover:text-cipher-primary transition-colors">Acceptable Use</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-700/50 text-center text-cipher-text-muted text-sm">
              <p>© {new Date().getFullYear()} CipherCode. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

// Component: How It Works Step
function HowItWorksStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-4xl font-bold text-cipher-primary mb-4">{number}</span>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-cipher-text-muted">{description}</p>
    </div>
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

// Component: FAQ Item
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-700/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-cipher-bg/30 transition-colors"
      >
        <span className="font-medium">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-cipher-text-muted text-sm">
          {answer}
        </div>
      )}
    </div>
  );
}

// FAQ data
const faqData = [
  {
    id: 1,
    question: 'What cryptocurrencies do you accept?',
    answer: 'We accept Bitcoin (BTC), Ethereum (ETH), and USDT in both TRC20 and ERC20 networks. We also support USDC on compatible networks. During checkout, select your preferred coin and we provide the exact amount needed along with a QR code for easy scanning.',
  },
  {
    id: 2,
    question: 'How do I receive my purchased script?',
    answer: 'Immediately after payment verification (typically within minutes), you will receive an email with your order confirmation and a secure download link. You can also access the project from your "Track My Order" page using the unique order code provided during checkout.',
  },
  {
    id: 3,
    question: 'Can I deploy to my own domain?',
    answer: 'Absolutely! With our optional deployment service, you can connect either a subdomain (e.g., app.yourbrand.com) or your custom domain. We handle all configuration including environment variables, SSL certificates, and database setup.',
  },
  {
    id: 4,
    question: 'What kind of support do you provide?',
    answer: 'Each script comes with comprehensive documentation and installation instructions. Our deployment service includes setup assistance and monitoring. For premium scripts, we offer ongoing technical support to ensure your application runs smoothly.',
  },
  {
    id: 5,
    question: 'Is my data protected?',
    answer: 'Absolutely. We prioritize your privacy and security. We do not collect IP addresses or user agent strings beyond what&rsquo;s necessary for rate limiting. All customer information is encrypted and automatically deleted after 30 days from order completion.',
  },
];
