import { auth, db } from "@/lib/firebase/config";
import { IContextType, IUser } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER: IUser = {
  uid: "",
  displayName: "",
  userName: "",
  email: "",
  photoURL: "",
  bio: "",
  emailVerified: false,
  phoneNumber: "",
  orders: 0,
  savedPosts: [],
  badges: [],
  type: "",
  rank: "",
  date: new Date(),
  isAadmin: false,
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: true, // Start with loading as true until auth state is known
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(true); // Initially true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentAccount) => {
      if (currentAccount) {
        try {
          const docRef = doc(db, "users", currentAccount.uid);
          const currentUser = await getDoc(docRef);

          if (currentUser.exists()) {
            setUser({
              ...(currentUser.data() as IUser),
            });
            if (currentUser.data().userName === "") {
              navigate("/set-username");
            }
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      } else {
        // No user is signed in
        setUser(INITIAL_USER);
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Loading is done
    });

    return () => unsubscribe();
  }, []);

  const checkAuthUser = async (): Promise<boolean> => {
    const currentAccount = auth.currentUser;

    if (currentAccount) {
      try {
        const docRef = doc(db, "users", currentAccount.uid);
        const currentUser = await getDoc(docRef);

        if (currentUser.exists()) {
          setUser({ ...(currentUser.data() as IUser) });
          setIsAuthenticated(true);
          return true; // User is authenticated
        } else {
          console.log("User document does not exist");
          return false; // User is not authenticated
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        return false; // Error occurred, consider the user as not authenticated
      }
    } else {
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      return false; // No user is signed in
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser, // This could be used manually in specific cases if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
