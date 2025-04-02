import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonButton, IonCard, IonCardContent, IonToggle, IonIcon
} from '@ionic/react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { wifiOutline } from 'ionicons/icons';

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [lastCity, setLastCity] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const history = useHistory();

  const toggleTheme = (isDark: boolean) => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    toggleTheme(darkMode);
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('🔍 Auth state changed:', user);
        setUser(user);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLastCity(docSnap.data().lastCity || '');
        }
      } else {
        console.log('🚫 No user logged in. Redirecting to /auth');
        history.push('/auth');
      }
    });
    return () => unsubscribe();
  }, [history]);

  const handleLogout = async () => {
    await signOut(auth);
    history.push('/auth');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">
            Welcome Home <IonIcon icon={wifiOutline} color="light" className="live-icon" style={{ marginLeft: '6px' }} />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem lines="none" className="ion-margin-top">
          <IonLabel>Dark Mode</IonLabel>
          <IonToggle
            checked={darkMode}
            onIonChange={(e) => setDarkMode(e.detail.checked)}
            color="dark"
          />
        </IonItem>

        <IonCard className="ion-margin-top ion-padding">
          <h3 className="ion-text-center">Welcome back 👋</h3>
          {user && (
            <p className="ion-text-center">
              Logged in as: <strong>{user.displayName || user.email}</strong>
            </p>
          )}
          {lastCity && (
            <p className="ion-text-center">
              Last city you searched: <strong>{lastCity}</strong>
            </p>
          )}
          <IonButton expand="block" color="success" className="ion-margin-top" onClick={() => history.push('/data')}>
            Go to Weather
          </IonButton>
          <IonButton expand="block" color="medium" className="ion-margin-top" onClick={handleLogout}>
            Logout
          </IonButton>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;