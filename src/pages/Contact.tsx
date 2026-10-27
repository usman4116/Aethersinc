import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { EMAIL, services } from '../data/content';
import { PixelA } from '../components/Brand';
import { Eyebrow } from '../components/UI';

export default function Contact() {
  const [params] = useSearchParams();
  const interest = params.get('interest') || '';
  const [draft, setDraft] = useState<{ href: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) || '').trim();
    const body = `Name: ${value('name')}\nEmail: ${value('email')}\nCompany: ${value('company') || 'Not specified'}\nInterested in: ${value('interest') || 'Let’s explore'}\n\n${value('message')}`;
    const subject = `Aethersync enquiry — ${value('interest') || 'New project'} — ${value('name')}`;
    setDraft({ href: `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, body });
    setCopied(false); setCopyError(false);
  }
  return <section className="contact-page grid-paper"><div className="container"><Eyebrow>Let’s start a conversation</Eyebrow><h1>Good things start<br /><span className="text-orange">with a hello.</span></h1><div className="contact-layout"><div className="contact-intro"><h2>What are you<br />thinking about?</h2><p>A platform to build. An ERP to deploy. A process that should be simpler. Tell us what you have in mind.</p><div className="contact-channel"><span className="mono">Write to us</span><a href={`mailto:${EMAIL}`}>{EMAIL}<ArrowUpRight size={19} /></a></div><div className="contact-company"><div><span className="mono">Company</span><strong>Aethersync Technology</strong></div><div><span className="mono">Established</span><strong>2023</strong></div></div><PixelA className="contact-mark" /></div><div className="contact-form-wrap"><form onSubmit={submit}><div className="form-heading"><h2>A little about your idea.</h2><span className="mono">* REQUIRED</span></div><div className="form-grid"><label htmlFor="name">Your name *<input id="name" name="name" autoComplete="name" placeholder="Alex Smith" required maxLength={150} /></label><label htmlFor="email">Email address *<input id="email" name="email" type="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254} /></label><label htmlFor="company">Company<input id="company" name="company" autoComplete="organization" placeholder="Your company" maxLength={200} /></label><label htmlFor="interest">I’m interested in<select id="interest" name="interest" key={interest} defaultValue={interest}><option value="">Let’s explore</option>{services.map(service => <option key={service.slug} value={service.title}>{service.title}</option>)}{interest && !services.some(service => service.title === interest) && <option value={interest}>{interest}</option>}</select></label><label htmlFor="message" className="form-full">Tell us about your project *<textarea id="message" name="message" rows={5} placeholder="The idea, the challenge, or the next big step…" required minLength={10} maxLength={10000} /></label></div><div className="form-submit-row"><button type="submit" className="button button-dark">Prepare your email<ArrowUpRight size={18} /></button><p>Compose your enquiry here,<br />then send it from your email app.</p></div></form>{draft && <div className="email-draft" role="status"><div className="draft-header"><Check size={22} /><h3>Your email is ready.</h3></div><p>Open your email app to review and send your message to <strong>{EMAIL}</strong>.</p><div className="draft-actions"><a className="button button-orange" href={draft.href}>Open email app<ArrowUpRight size={16} /></a><button type="button" className="button button-outline" onClick={async () => { try { await navigator.clipboard.writeText(draft.body); setCopied(true); setCopyError(false); } catch { setCopyError(true); } }}><Copy size={15} />{copied ? 'Copied' : 'Copy message'}</button></div>{copyError && <p>Select and copy the message below.</p>}<details><summary>Review your message</summary><pre>{draft.body}</pre></details></div>}</div></div></div></section>;
}
