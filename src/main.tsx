import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './motion.css';
import './hero.css';
import './pages.css';
import './storytelling.css';
import './refinement.css';
import './discovery.css';

const root = document.getElementById('root')!;
const app = <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>;
// Production pages contain the same rendered application for visitors and crawlers.
if (root.dataset.prerendered === 'true') ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);

import './editorial.css';
