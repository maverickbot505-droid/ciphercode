'use client';

import { useState } from 'react';

export default function Projects() {
  const [projects] = useState([
    { id: 1, title: "E-Commerce Store", price: 299.99, status: "Published" as const },
    { id: 2, title: "Portfolio Template", price: 49.99, status: "Published" as const },
    { id: 3, title: "Blog Platform", price: 199.99, status: "Hidden" as const },
    { id: 4, title: "CRM System", price: 599.99, status: "Draft" as const },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <div className="flex gap-4">
          <SearchInput placeholder="Search projects..." />
          <Button variant="primary" onClick={() => {}}>Add Project</Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

// Component: Project Card
function ProjectCard({ project }: { project: any }) {
  return (
    <div className="card hover:border-cipher-primary transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{project.title}</h3>
        <StatusBadge status={project.status} />
      </div>

      <p className="text-sm text-cipher-text-muted mb-4 line-clamp-2">
        Ready-to-use web application script with comprehensive documentation.
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold">${project.price.toFixed(2)}</span>
        <Button variant="primary" size="small">Edit</Button>
      </div>
    </div>
  );
}

// Component: Status Badge
function StatusBadge({ status }: { status: string }) {
  const styles = {
    Published: 'bg-green-500/20 text-green-400 border-green-500/30',
    Hidden: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    SoldOut: 'bg-red-500/20 text-red-400 border-red-500/30',
  } as const;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

// Component: Search Input
function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="px-4 py-2 bg-cipher-bg border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:border-cipher-primary focus:ring-2 focus:ring-cipher-primary/20 transition-all"
    />
  );
}

// Component: Button
function Button({ 
  variant = 'secondary',
  size = 'medium',
  onClick,
  children
}: { 
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: 'bg-cipher-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20',
    secondary: 'bg-cipher-secondary hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20',
    outline: 'border-2 border-cipher-primary text-cipher-primary hover:bg-cipher-primary/10',
  } as const;

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  } as const;

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </button>
  );
}
