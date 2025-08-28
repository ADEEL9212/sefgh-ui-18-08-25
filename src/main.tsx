import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAllEasterEggs } from './lib/easter-eggs'

// Initialize Easter eggs when the app starts
initializeAllEasterEggs();

createRoot(document.getElementById("root")!).render(<App />);
