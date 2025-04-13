import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonAvatar, IonCard, IonCardContent } from '@ionic/react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';  // Ensure this is your correct Firebase config
import { useHistory } from 'react-router-dom';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);  // Store the user data
  const history = useHistory();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);  // Set the user state when authenticated
    } else {
      history.push('/auth');  // Redirect to login if not authenticated
    }
  }, [history]);

  const handleLogout = async () => {
    await signOut(auth);
    history.push('/auth');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {user ? (
          <>
            <IonCard style={{ textAlign: 'center', marginBottom: '20px' }}>
              <IonCardContent>
                <IonAvatar style={{ margin: 'auto', display: 'block' }}>
                  <img src={user.photoURL || "https://via.placeholder.com/150"} alt="Profile" />
                </IonAvatar>
                <h2>{user.displayName || 'No name available'}</h2>
                <p>{user.email}</p>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardContent>
                <IonItem lines="none">
                  <IonLabel position="stacked">Name</IonLabel>
                  <IonLabel>{user.displayName || 'No name available'}</IonLabel>
                </IonItem>

                <IonItem lines="none">
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonLabel>{user.email}</IonLabel>
                </IonItem>

                <IonItem lines="none">
                  <IonLabel position="stacked">Joined</IonLabel>
                  <IonLabel>{new Date(user.metadata.creationTime).toLocaleDateString()}</IonLabel>
                </IonItem>
              </IonCardContent>
            </IonCard>

            <IonButton expand="block" color="danger" onClick={handleLogout} style={{ marginTop: '20px' }}>
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

export default Profile;
