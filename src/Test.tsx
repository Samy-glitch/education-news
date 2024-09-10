import {
  collection,
  getDocs,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./lib/firebase/config";
import { Button } from "./components/ui/button";

const YearSelect = () => {
  const orderByDate = (timestamp: Timestamp): String => {
    const date = timestamp.toDate();
    const year = date.getFullYear().toString(); // Full year (e.g., 2024)
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month, padded to 2 digits
    const day = date.getDate().toString().padStart(2, "0"); // Day, padded to 2 digits
    const hours = date.getHours().toString().padStart(2, "0"); // Hours, padded to 2 digits
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Minutes, padded to 2 digits

    return `${year}${month}${day}${hours}${minutes}`;
  };

  async function migrateQnaToPosts() {
    try {
      const qnaCollectionRef = collection(db, "users");

      const qnaSnapshot = await getDocs(qnaCollectionRef);

      for (const qnaDoc of qnaSnapshot.docs) {
        const qnaData = qnaDoc.data();

        const postsDocRef = doc(db, "users", qnaDoc.id);

        const postData = {
          ...qnaData,
          badges: qnaData.badges || [],
        };

        await updateDoc(postsDocRef, postData);

        console.log(`Migrated document ID: ${qnaDoc.id}`);
      }

      console.log("Migration completed successfully!");
    } catch (error) {
      console.error("Error migrating data:", error);
    }
  }

  // const testDate = "3 June 2024";
  // const newTestDate = new Date(testDate);

  // console.log(newTestDate);

  return (
    <div className="h-[80vh] w-full flex-start">
      <Button className="mx-auto" /* onClick={migrateQnaToPosts} */>
        Start
      </Button>
    </div>
  );
};

export default YearSelect;
