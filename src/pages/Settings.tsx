import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const Settings: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <p>Update API or user settings here.</p>
    </IonContent>
  </IonPage>
);

export default Settings;
