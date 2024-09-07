import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  const usersRef = collection(db, "users"); // Replace with your collection name
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

export const checkIfUsernameExists = async (
  username: string
): Promise<boolean> => {
  const newUsername = `@${username.toLocaleLowerCase()}`;
  const usersRef = collection(db, "users"); // Replace with your collection name
  const q = query(usersRef, where("userName", "==", newUsername));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};
