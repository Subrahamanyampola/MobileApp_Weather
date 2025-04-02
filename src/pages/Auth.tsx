import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonButton, IonToast, IonSegment, IonSegmentButton, IonIcon, IonCard, IonCardContent
} from "@ionic/react";
import { logoGoogle } from 'ionicons/icons';
import { useState } from "react";
import { auth, googleProvider, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const showMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const handleAuth = async () => {
    if (!isLogin && password !== confirmPass) {
      showMessage("Passwords do not match ❌");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage("Login Successful ✅");
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          username: username,
          createdAt: new Date().toISOString(),
        });

        showMessage("Registered Successfully 🎉");
      }

      setTimeout(() => history.push("/home"), 1000);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        showMessage("This email is already registered. Please login instead.");
      } else if (error.code === "auth/invalid-email") {
        showMessage("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        showMessage("Password should be at least 6 characters.");
      } else if (error.code === "auth/wrong-password") {
        showMessage("Incorrect password ❌");
      } else if (error.code === "auth/user-not-found") {
        showMessage("User not found. Please register.");
      } else {
        showMessage(error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      showMessage("Google Sign-in Success ✅");
      setTimeout(() => history.push("/home"), 1000);
    } catch (error: any) {
      showMessage(error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">{isLogin ? "Login" : "Register"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{
        background: "linear-gradient(to bottom right, #2b5876, #4e4376)",
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <IonCard style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)"
        }}>
          <IonCardContent>
            <IonSegment value={isLogin ? "login" : "register"} onIonChange={(e) => setIsLogin(e.detail.value === "login")}>
              <IonSegmentButton value="login">
                <IonLabel>Login</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="register">
                <IonLabel>Register</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {!isLogin && (
              <IonItem lines="none">
                <IonLabel position="stacked">Username</IonLabel>
                <IonInput value={username} onIonChange={(e) => setUsername(e.detail.value!)} />
              </IonItem>
            )}

            <IonItem lines="none">
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
            </IonItem>
            <IonItem lines="none">
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
            </IonItem>
            {!isLogin && (
              <IonItem lines="none">
                <IonLabel position="stacked">Confirm Password</IonLabel>
                <IonInput type="password" value={confirmPass} onIonChange={(e) => setConfirmPass(e.detail.value!)} />
              </IonItem>
            )}

            <IonButton expand="block" color="primary" onClick={handleAuth} className="ion-margin-top">
              {isLogin ? "Login" : "Register"}
            </IonButton>

            <IonButton expand="block" color="light" onClick={handleGoogleLogin}>
              <IonIcon icon={logoGoogle} slot="start" />
              Sign in with Google
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonToast isOpen={showToast} message={toastMessage} duration={2000} onDidDismiss={() => setShowToast(false)} />
      </IonContent>
    </IonPage>
  );
};

export default Auth;
