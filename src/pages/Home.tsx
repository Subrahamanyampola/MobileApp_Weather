import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';  // Ensure this is your correct Firebase configuration file
import { useHistory } from 'react-router-dom';
import './Home.css';



const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);  // Store the logged-in user
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // Set the user state when authenticated
      } else {
        history.push('/auth');  // Redirect to auth page if not authenticated
      }
    });

    return () => unsubscribe();  // Clean up when the component is unmounted
  }, [history]);

  const handleLogout = async () => {
    await signOut(auth);
    history.push('/auth');  // Redirect to auth page after logout
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {user ? (
          <>
            <p>Welcome back, {user.displayName || user.email}!</p> {/* Display username or email */}
            <IonButton expand="block" onClick={() => history.push('/data')}>
              Go to Crypto Prices
            </IonButton>
            <IonButton expand="block" onClick={() => history.push('/settings')}>
              Go to Settings
            </IonButton>
            <IonButton expand="block" onClick={handleLogout}>
              Logout
            </IonButton>
          </>
        ) : (
          <p>Redirecting to login...</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
