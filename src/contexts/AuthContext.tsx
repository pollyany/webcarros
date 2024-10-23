import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";
import logoImg from "../assets/logo.png";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  user: UserProps | null;
  settings: SettingsProps;
};

interface UserProps {
  uid: string;
  email: string | null;
}
interface SettingsProps {
  primaryColor: string;
  logo: string;
  links: {
    whatsapp: string;
    instagram: string;
  };
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [settings, setSettings] = useState<SettingsProps>({
    primaryColor: "#ef4444",
    logo: logoImg,
    links: { whatsapp: "99999999", instagram: "teste"},
  });

  useEffect(() => {
    loadSettings();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user?.email,
        });

        setLoadingAuth(false);
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  async function loadSettings() {
    const docRef = doc(db, "user", "settings");
    await getDoc(docRef).then((snapshot) => {
      setSettings({
        primaryColor: snapshot?.data()?.primaryColor,
        logo: snapshot?.data()?.logo,
        links: {
          whatsapp: snapshot?.data()?.whatsapp,
          instagram: snapshot?.data()?.instagram,
        }
      });
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
        user,
        settings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
