import {
  IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import { home, personCircle, analytics, settings } from 'ionicons/icons'; // ✅ Add this line!

import Home from './pages/Home';
import Auth from './pages/Auth';
import DataView from './pages/DataView';
import Settings from './pages/Settings';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home" component={Home} />
          <Route exact path="/auth" component={Auth} />
          <Route exact path="/data" component={DataView} />
          <Route exact path="/settings" component={Settings} />
          <Redirect exact from="/" to="/home" />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="auth" href="/auth">
            <IonIcon icon={personCircle} />
            <IonLabel>Auth</IonLabel>
          </IonTabButton>
          <IonTabButton tab="data" href="/data">
            <IonIcon icon={analytics} />
            <IonLabel>Data</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
