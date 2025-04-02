import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/* Initialize Ionic React */
import { setupIonicReact } from '@ionic/react';
setupIonicReact();

/* Ionic core and basic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Register service worker for PWA */
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // ✅

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 🔧 Make it installable as PWA
serviceWorkerRegistration.register(); // ✅
