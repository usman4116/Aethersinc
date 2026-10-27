import { useCallback, useState } from 'react';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { clientProjects, projectCategories, type ClientProject } from '../data/projects';
import { DesignPage, PageEnd, TitleLine } from '../components/DesignPage';
import { WorkReel } from '../components/WorkReel';
import { WorkPreview, type WorkPreviewSelection } from '../components/WorkPreview';

export default function Projects() {
  const [category, setCategory] = useState<string>('All work');
  const [selection, setSelection] = useState<WorkPreviewSelection | null>(null);
  const projects = clientProjects.filter(p => category === 'All work' || p.category === category);
  const dismiss = useCallback(() => setSelection(null), []);
  const open = (project: ClientProject, source: HTMLButtonElement) => setSelection({project, source, bounds: source.getBoundingClientRect(), mode: 'click'});
  return <DesignPage className="portfolio-design">
    <section className="portfolio-intro"><div className="container"><div className="portfolio-topline mono"><span>Selected work / 03</span><span>Independent ideas. Out in the world.</span></div><div className="portfolio-title-grid"><h1><TitleLine>Made to</TitleLine><TitleLine className="portfolio-title-accent">stand out.</TitleLine></h1><div data-reveal><span className="portfolio-edition">07<ArrowUpRight size={37} strokeWidth={1.2} /></span><p>Different businesses. Distinctive experiences.<br />A collection of websites with a point of view.</p><span className="mono">THE AETHERSYNC PORTFOLIO</span></div></div>
    </div></section>
    <WorkReel onOpen={open} />
    <section className="work-archive" id="work-archive"><div className="container"><div className="design-section-heading" data-reveal><div><span className="design-kicker mono">A collection of possibilities</span><h2>The work.<sup>(07)</sup></h2></div><p>From considered storefronts to memorable first impressions.<br />Every project starts with a different story.</p></div><div className="design-filter-bar"><div className="design-filters" role="group" aria-label="Filter client work">{projectCategories.map(item => <button key={item} type="button" aria-pressed={item===category} onClick={() => setCategory(item)}>{item}</button>)}</div><span className="mono" aria-live="polite">{String(projects.length).padStart(2,'0')} PROJECTS</span></div><div className={`archive-grid ${category !== 'All work'?'archive-filtered':''}`}>{projects.map(project => <article className="archive-project" key={project.slug}><button type="button" className="archive-image" onClick={event => open(project,event.currentTarget)} aria-label={`Enlarge ${project.name} website`} aria-haspopup="dialog"><img src={project.image} alt={`${project.name} website design`} width="1280" height="800" loading="lazy" /><span className="archive-view"><Maximize2 size={20} /><span>TAKE A CLOSER LOOK</span></span></button><div className="archive-project-heading"><div><span className="mono">{project.category}</span><h3>{project.name}</h3></div><a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} live website`}><ArrowUpRight size={24} /></a></div><p>{project.description}</p><ul className="archive-tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></article>)}</div></div></section>
    <PageEnd>Your story.<br /><em>Our next chapter.</em></PageEnd>
    {selection && <WorkPreview selection={selection} onDismiss={dismiss} />}
  </DesignPage>;
}
