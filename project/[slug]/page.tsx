import ProjectDetail from '../../project/[slug]';

export default function ProjectDetailPage({ 
  params 
}: { 
  params: { slug: string }
}) {
  return <ProjectDetail params={params} />;
}
