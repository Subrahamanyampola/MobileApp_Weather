import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonToast } from '@ionic/react';

const Settings: React.FC = () => {
  const [currency, setCurrency] = useState<string>('usd');
  const [showToast, setShowToast] = useState(false);

  // Load the preferred currency from localStorage if it exists
  useEffect(() => {
    const storedCurrency = localStorage.getItem('preferredCurrency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  const handleCurrencyChange = (value: string) => {
    if (value !== currency) {
      setCurrency(value); // Update the state with the new currency
      localStorage.setItem('preferredCurrency', value); // Save the selected currency to localStorage
      setShowToast(true); // Show the toast notification
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Preferred Currency</IonLabel>
          <IonSelect
            value={currency}
            onIonChange={(e) => handleCurrencyChange(e.detail.value!)} // Handle currency change
          >
            <IonSelectOption value="usd">USD - US Dollar</IonSelectOption>
            <IonSelectOption value="eur">EUR - Euro</IonSelectOption>
            <IonSelectOption value="inr">INR - Indian Rupee</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* Show Toast when the currency is updated */}
        <IonToast
          isOpen={showToast}
          message={`Currency updated to ${currency.toUpperCase()}`}
          duration={1500}
          onDidDismiss={() => setShowToast(false)} // Reset toast visibility after dismissal
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
