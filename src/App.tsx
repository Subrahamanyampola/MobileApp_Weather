import React, { useEffect, useState } from 'react';
import { IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import './global.css'; // Add this at the top of your index.tsx or App.tsx

import { home, logIn, analytics, person } from 'ionicons/icons'; // Removed settings import
import Home from './pages/Home';
import Auth from './pages/Auth';
import DataView from './pages/DataView';
import Profile from './pages/Profile';
import Settings from './pages/Settings'; // Keep the Settings page

import { auth } from './firebaseConfig';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null); // To track the user status

  useEffect(() => {
    // Set up an observer on the auth state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update the user state based on auth status
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* Redirect to home if logged in, otherwise to auth (login) */}
            <Route exact path="/home" component={Home} />
            <Route exact path="/auth" component={Auth} />
            <Route exact path="/data" component={DataView} /> {/* Crypto page */}
            <Route exact path="/profile" component={Profile} /> {/* Profile page */}
            <Route exact path="/settings" component={Settings} /> {/* Settings page */}
            <Redirect exact from="/" to={user ? "/home" : "/auth"} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            {/* Home Tab */}
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            {/* Crypto Tab */}
            <IonTabButton tab="data" href="/data">
              <IonIcon icon={analytics} />
              <IonLabel>Crypto</IonLabel>
            </IonTabButton>

            {/* Profile Tab */}
            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={person} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>

            {/* Login Tab (Visible only if the user is not logged in) */}
            {!user && (
              <IonTabButton tab="auth" href="/auth">
                <IonIcon icon={logIn} />
                <IonLabel>Login</IonLabel>
              </IonTabButton>
            )}
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
