import React, { useEffect, useState, useRef } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonSpinner,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg,
  IonSegment, IonSegmentButton, IonToggle, IonBadge
} from '@ionic/react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_KEY = 'a2c4ed8d0e2e807c10714095bd61466c';

const DataView: React.FC = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'current' | 'forecast'>('current');
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const [rainAlert, setRainAlert] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

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
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShowInstallBtn(false);
      });
    }
  };

  const getVisualVibe = (weatherType: string) => {
    const type = weatherType.toLowerCase();
    if (type.includes('rain')) return '/assets/rain.jpg';
    if (type.includes('clear')) return '/assets/sunny.jpg';
    if (type.includes('cloud')) return '/assets/cloudy.jpg';
    if (type.includes('snow')) return '/assets/snow.jpg';
    if (type.includes('thunder')) return '/assets/storm.jpg';
    return '/assets/default.jpg';
  };

  const fetchData = async (customCity?: string) => {
    const selectedCity = customCity || city;
    if (!selectedCity) return;
    setLoading(true);
    setError('');

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=${API_KEY}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=${API_KEY}`)
      ]);

      setCurrentWeather(currentRes.data);
      const weatherType = currentRes.data.weather[0].main;
      const weatherMain = weatherType.toLowerCase();
      setBackgroundImage(getVisualVibe(weatherType));

      if (["rain", "thunderstorm", "drizzle"].includes(weatherMain)) {
        setRainAlert(`⚠️ Alert: ${weatherMain.toUpperCase()} expected today! Carry an umbrella ☂️`);
      } else {
        setRainAlert('');
      }

      const filtered = forecastRes.data.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
      setForecastData(filtered);

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          await setDoc(doc(db, "users", user.uid), { lastCity: selectedCity }, { merge: true });
          await addDoc(collection(db, "users", user.uid, "searches"), {
            city: selectedCity,
            timestamp: new Date().toISOString(),
          });
          fetchRecentCities(user.uid);
        }
      });
    } catch (err) {
      console.error(err);
      setError("City not found or API error");
      setCurrentWeather(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentCities = async (uid: string) => {
    const q = query(collection(db, "users", uid, "searches"), orderBy("timestamp", "desc"), limit(3));
    const snap = await getDocs(q);
    const cities = snap.docs.map(doc => doc.data().city);
    setRecentCities(cities);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      setCity(res.data.name);
      fetchData(res.data.name);
    });

    onAuthStateChanged(auth, (user) => {
      if (user) fetchRecentCities(user.uid);
    });
  }, []);

  useEffect(() => {
    if (refreshInterval.current) clearInterval(refreshInterval.current);
    refreshInterval.current = setInterval(() => {
      if (city) fetchData(city);
    }, 40000);
    return () => clearInterval(refreshInterval.current!);
  }, [city]);

  const labels = forecastData.map(item =>
    new Date(item.dt_txt).toLocaleDateString('en-GB', { weekday: 'short' })
  );
  const temperatures = forecastData.map(item => item.main.temp);
  const icons = forecastData.map(item =>
    `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Temp (°C)',
        data: temperatures,
        fill: true,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">
            Weather App <IonBadge color="success">📡 LIVE</IonBadge>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <IonItem lines="none" className="ion-margin-top">
          <IonLabel>Dark Mode</IonLabel>
          <IonToggle
            checked={darkMode}
            onIonChange={(e) => setDarkMode(e.detail.checked)}
            color="dark"
          />
        </IonItem>

        {showInstallBtn && (
          <IonButton expand="block" onClick={handleInstall} className="ion-margin-top" color="tertiary">
            Add to Home Screen 📲
          </IonButton>
        )}

        {recentCities.length > 0 && (
          <IonCard className="ion-margin-top ion-padding">
            <h4>Recent Cities</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {recentCities.map((cityName, idx) => (
                <IonButton key={idx} size="small" onClick={() => { setCity(cityName); fetchData(cityName); }}>
                  {cityName}
                </IonButton>
              ))}
            </div>
          </IonCard>
        )}

        <IonItem>
          <IonLabel position="stacked">Enter City</IonLabel>
          <IonInput
            value={city}
            onIonChange={(e) => setCity(e.detail.value!)}
            placeholder="e.g., Dublin"
          />
        </IonItem>

        <IonButton expand="block" onClick={() => fetchData()} className="ion-margin-top">
          Refresh
        </IonButton>

        {loading && (
          <div className="ion-text-center ion-margin-top">
            <IonSpinner name="dots" />
          </div>
        )}

        {error && <p className="ion-text-center ion-text-danger">{error}</p>}

        {rainAlert && (
          <IonCard color="danger" className="ion-margin-top ion-padding">
            <h4 style={{ color: 'white', margin: 0 }}>{rainAlert}</h4>
          </IonCard>
        )}

        <IonSegment value={view} onIonChange={e => setView(e.detail.value as 'current' | 'forecast')} className="ion-margin-top">
          <IonSegmentButton value="current">
            <IonLabel>Current</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="forecast">
            <IonLabel>Forecast</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {view === 'current' && currentWeather && !loading && (
          <IonCard className="ion-margin-top">
            <IonCardHeader>
              <IonCardTitle>{currentWeather.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonImg
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                alt="weather-icon"
              />
              <p><strong>Temperature:</strong> {currentWeather.main.temp}°C</p>
              <p><strong>Condition:</strong> {currentWeather.weather[0].description}</p>
              <p><strong>Humidity:</strong> {currentWeather.main.humidity}%</p>
              <p><strong>Wind:</strong> {currentWeather.wind.speed} m/s</p>
            </IonCardContent>
          </IonCard>
        )}

        {view === 'forecast' && forecastData.length > 0 && !loading && (
          <>
            <div style={{ height: '300px', marginTop: '20px' }}>
              <Line data={chartData} />
            </div>
            <IonCard className="ion-margin-top ion-padding">
              <h3 className="ion-text-center">Forecast Icons</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {icons.map((icon, idx) => (
                  <img key={idx} src={icon} alt={`Day ${idx}`} height="50" />
                ))}
              </div>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DataView;
