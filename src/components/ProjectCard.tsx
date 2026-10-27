import { ArrowUpRight } from 'lucide-react';
import type { ClientProject } from '../data/projects';

export function ProjectCard({ project, index = 0 }: { project: ClientProject; index?: number }) {
  return <article className="project-card"><a href={project.url} target="_blank" rel="noopener noreferrer" className="project-image" aria-label={`Visit ${project.name} live website, opens in a new tab`}><div className="browser-bar"><span /><span /><span /><span className="browser-label mono">{project.deliverable}</span><ArrowUpRight size={14} /></div><img src={project.image} alt={`${project.name} website design`} width="1200" height="900" loading="lazy" /><span className="project-visit">Visit live website<ArrowUpRight size={16} /></span></a><div className="project-caption"><div><span className="mono">{project.category}</span><h3><a href={project.url} target="_blank" rel="noopener noreferrer">{project.name}</a></h3></div><span className="project-number mono">{String(index + 1).padStart(2, '0')}</span></div><p>{project.description}</p></article>;
}
