import { useState } from 'react';
import { clientProjects, projectCategories } from '../data/projects';
import { ContactCta, PageHero } from '../components/UI';
import { ProjectCard } from '../components/ProjectCard';

export default function Projects() {
  const [category, setCategory] = useState<string>('All work');
  const projects = clientProjects.filter(p => category === 'All work' || p.category === category);
  return <><PageHero eyebrow="Selected client work" title={<>Different businesses.<br /><span className="text-orange">Distinctive experiences.</span></>} description="Seven client websites, each with its own story. Explore the storefronts, service experiences and catalogues we’ve helped bring to life." /><section className="section projects-catalog"><div className="container"><div className="filter-bar"><div className="filter-buttons project-filters" role="group" aria-label="Filter client work">{projectCategories.map(item => <button type="button" key={item} aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}</div><span className="mono result-count" aria-live="polite">{String(projects.length).padStart(2, '0')} PROJECTS</span></div><div className="projects-grid">{projects.map(project => <div key={project.slug}><ProjectCard project={project} index={clientProjects.indexOf(project)} /><ul className="project-tags">{project.tags.map(tag => <li className="mono" key={tag}>{tag}</li>)}</ul></div>)}</div></div></section><ContactCta /></>;
}
