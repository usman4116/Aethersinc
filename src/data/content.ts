import { BrainCircuit, CloudCog, Code2, Database, Globe2, Layers3, Network, ShieldCheck, Shirt, Sparkles, Wallet } from 'lucide-react';

export const EMAIL = 'ceo@theaethersync.com';

export const products = [
  { slug: 'purple-ai', name: 'Purple AI', category: 'AI / Business Assistant', status: 'In development', description: 'Your intelligent business assistant for long-horizon workflows and autonomous task execution.', headline: 'Less busywork. More possibility.', features: ['Autonomous workflows', 'Business assistance', 'Long-horizon tasks'], url: null, logo: '/logos/purpleai.jpg', icon: BrainCircuit, color: 'purple' },
  { slug: 'open-erp', name: 'Open ERP', category: 'Enterprise Resource Planning', status: 'Live', description: 'Complete enterprise resource planning customized to your unique processes. Deploy scalable operations across every branch.', headline: 'Every branch. One clear picture.', features: ['Multi-branch operations', 'Connected departments', 'Custom workflows'], url: 'https://www.openerp.pk/', logo: '/logos/openerp.jpg', icon: Database, color: 'green' },
  { slug: 'corpflow', name: 'Corpflow', category: 'Internal Tools & Operations', status: 'Live', description: 'Build, test, and run internal tools and business operations from one console.', headline: 'Bring your operations into flow.', features: ['Internal tools', 'Team workflows', 'One operations console'], url: 'https://corpfloww.vercel.app/', logo: '/logos/corpflow.jpg', icon: Layers3, color: 'blue' },
  { slug: 'finraze', name: 'Finraze', category: 'Finance & Accounting', status: 'Live', description: 'Modern cloud accounting and tax reporting workflows.', headline: 'Make the numbers make sense.', features: ['Cloud accounting', 'Tax reporting', 'Connected finances'], url: 'https://finnraze.vercel.app/', logo: '/logos/finraze.png', icon: Wallet, color: 'yellow' },
  { slug: 'fact-checking', name: 'Fact Checking', category: 'AI / Verification', status: 'In development', description: 'AI-assisted verification platform for strict source validation.', headline: 'Better answers start with better sources.', features: ['Source validation', 'AI-assisted checking', 'Traceable verification'], url: null, logo: null, icon: ShieldCheck, color: 'orange' },
  { slug: 'laundry-management', name: 'Laundry Management', category: 'Management Software', status: 'In development', description: 'Digital management platform optimizing pickup, delivery, and billing operations at scale.', headline: 'A smoother journey from pickup to delivery.', features: ['Pickup & delivery', 'Order management', 'Connected billing'], url: null, logo: null, icon: Shirt, color: 'pink' },
  { slug: 'futurepath-ai', name: 'FuturePath AI', category: 'AI / Decision Intelligence', status: 'Live', description: 'Decision intelligence for the choices that compound: model the financial and personal impact of a major decision, with a risk score and a confidence figure, before you commit to it.', headline: 'See the possibilities before you choose.', features: ['Decision modelling', 'Risk estimates', 'Scenario exploration'], url: 'https://www.futurepathai.org/', logo: null, icon: Sparkles, color: 'blue' },
] as const;

export type Product = typeof products[number];

export const services = [
  { slug: 'custom-software', title: 'Custom software', fullTitle: 'Custom Software Development', icon: Code2, description: 'Software built to your exact business requirements, so every feature aligns with the workflow it serves.', points: ['Workflow discovery', 'Product design & development', 'Maintainable architecture', 'Working software, delivered'] },
  { slug: 'ai-development', title: 'AI & agentic workflows', fullTitle: 'AI Development & Agentic Workflows', icon: BrainCircuit, description: 'Intelligent applications, agentic workflows and generative models that carry work end to end.', points: ['Applied AI models', 'Autonomous task workflows', 'Embedded business assistants', 'Source validation'] },
  { slug: 'erp-systems', title: 'ERP systems', fullTitle: 'ERP Design, Customization & Deployment', icon: Database, description: 'Enterprise resource planning designed, customised and deployed — centralising operations across every branch.', points: ['Process customisation', 'Multi-branch operations', 'Data migration & deployment', 'Connected departments'] },
  { slug: 'web-mobile', title: 'Web & mobile apps', fullTitle: 'Web & Mobile Application Development', icon: Globe2, description: 'Modern, responsive, scalable web applications, and high-performance Android and iOS apps with real-time cloud data.', points: ['Responsive web applications', 'Android & iOS experiences', 'Real-time cloud data', 'Accessible interface design'] },
  { slug: 'cloud-devops', title: 'Cloud & DevOps', fullTitle: 'Cloud Infrastructure & DevOps', icon: CloudCog, description: 'Secure, scalable infrastructure using Docker, Kubernetes, CI/CD pipelines and cloud platforms.', points: ['Docker containers', 'Kubernetes orchestration', 'CI/CD pipelines', 'Cloud platform deployment'] },
  { slug: 'integration-automation', title: 'Integration & automation', fullTitle: 'API Integration & Business Automation', icon: Network, description: 'Connect existing software, third-party services and enterprise platforms — then automate approvals, reporting and repetitive operations.', points: ['API integration', 'Connected enterprise platforms', 'Automated approvals & reports', 'Operational workflows'] },
] as const;

export const founders = [
  { name: 'Muhammad Usman Farhan', role: 'CEO & Founder', initials: 'UF', image: '/founder.jpg', bio: 'Visionary engineer and entrepreneur driving the AetherSync mission to build scalable enterprise ERP systems, custom software architectures, and autonomous AI-driven business automation solutions for modern global enterprises.' },
  { name: 'Muhammad Abdullah Bhatti', role: 'Co-Founder · Core Architecture', initials: 'AB', image: null, bio: 'Core architect and product strategist shaping the AetherSync ecosystem — specializing in enterprise ERP infrastructure, full-stack software engineering, and high-performance cloud automation platforms.' },
] as const;

export const process = [
  { title: 'Discovery', description: 'We map your operations, interview stakeholders, and agree the outcomes that define success before a line of code exists.', deliverables: ['Stakeholder interviews', 'Process audit', 'Success metrics'] },
  { title: 'Requirement analysis', description: 'Functional specs, data models and integration boundaries are documented so every team builds against the same blueprint.', deliverables: ['Technical spec', 'Data model', 'Integration map'] },
  { title: 'UI/UX design', description: 'Clickable prototypes let you use the product before it is built, so feedback arrives while changes are still cheap.', deliverables: ['Wireframes', 'Design system', 'Clickable prototype'] },
  { title: 'Development', description: 'Two-week sprints with working software at the end of each one. You see progress continuously.', deliverables: ['Sprint demos', 'Code review', 'Staging builds'] },
  { title: 'Testing', description: 'Automated suites, load testing and a full security pass — including penetration testing for regulated workloads.', deliverables: ['Automated tests', 'Load profile', 'Security audit'] },
  { title: 'Deployment', description: 'Containerized rollout with monitoring, alerting and rollback wired in from the first release.', deliverables: ['CI/CD pipeline', 'Monitoring', 'Rollback plan'] },
  { title: 'Continuous support', description: 'Post-launch we stay on: security patching, performance tuning, and the next set of features on a standing SLA.', deliverables: ['Security patching', 'Performance tuning', 'Feature roadmap'] },
] as const;

export const advantages = [
  ['AI-first development', 'Proprietary and open-source models embedded directly into core business operations.'],
  ['Enterprise ERP expertise', 'Tailored ERP customisation that keeps departments and branches in sync.'],
  ['Scalable cloud architecture', 'Containerised infrastructure designed to grow with your product.'],
  ['Custom business solutions', 'Software shaped around your processes, goals and future growth.'],
  ['Modern technology stack', 'React, Next.js, Node.js, Python, PostgreSQL and Odoo.'],
  ['Long-term technical support', 'Post-launch security updates, maintenance and continued development.'],
] as const;

export const technologies = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Odoo', 'Docker', 'Kubernetes', 'AWS', 'Redis', 'FastAPI'];
