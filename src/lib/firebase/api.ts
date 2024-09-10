import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  IBookDataTable,
  IBooks,
  ICreatePost,
  INewsDataTable,
  INewses,
  INewUser,
  IPost,
  IUser,
} from "@/types";
import { auth, db, storage } from "./config";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { orderByDate } from "../utils";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    ).then((userCredential) => {
      const newUser = userCredential.user;
      updateProfile(newUser, {
        displayName: user.name,
      }).then(async () => {
        await saveUserToDB({
          accountId: newUser.uid,
          email: newUser.email || "err",
          name: newUser.displayName || "err",
          imageUrl: "",
          username: user.username,
        });
      });
    });
    localStorage.setItem("oldUser", "true");
    return newAccount;
  } catch (error) {
    console.log(error);
    localStorage.removeItem("user");
    throw Error;
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const session = await signInWithPopup(auth, provider).then(
      async (result) => {
        const { isNewUser } = getAdditionalUserInfo(result) || {};
        const newUser = result.user;
        if (isNewUser) {
          await saveUserToDB({
            accountId: newUser.uid,
            email: newUser.email || "err",
            name: newUser.displayName || "err",
            imageUrl: newUser.photoURL || "",
            username: "",
          });
        }
        return result; // Ensure the session result is returned correctly
      }
    );

    if (!session) throw new Error("Google sign-in failed");

    localStorage.setItem("isReturningUser", "true");
    return session;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const docRef = setDoc(doc(db, "users", user.accountId), {
      uid: user.accountId,
      displayName: user.name,
      userName: user.username,
      email: user.email,
      photoURL: user.imageUrl || "",
      bio: "",
      emailVerified: false,
      phoneNumber: "",
      orders: 0,
      savedPosts: [],
      type: "emailLogin",
      rank: "free",
      isAadmin: false,
      date: new Date(),
    }).catch((err: { message: string }) => {
      console.log(err.message);
    });

    return docRef;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
    if (!session) throw Error;
    else localStorage.setItem("oldUser", "true");
    return session;
  } catch (error) {
    console.log(error);
    throw error; // Ensure error is propagated for the caller to handle
  }
}

export async function getUserById(uid: string): Promise<IUser | null> {
  try {
    const docRef = doc(db, "users", uid);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      return userDoc.data() as IUser;
    } else {
      console.log("User document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data");
  }
}

export async function signOutAccount() {
  try {
    const session = await signOut(auth);

    localStorage.setItem("oldUser", "true");

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getDocFromDB(database: string, id: string) {
  try {
    const docRef = doc(db, database, id);
    const docData = await getDoc(docRef);

    if (docData.exists()) {
      return docData.data(); // Return the data
    } else {
      return null; // Data not found
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw new Error("Failed to fetch data");
  }
}

export async function uploadUserImageToFirebase(
  imageBlob: Blob,
  userId: string
): Promise<string> {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `images/user/${userId}.png`);

    const snapshot = await uploadBytes(storageRef, imageBlob);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// Posts

export async function getRecentPosts() {
  const colRef = collection(db, "posts");
  const q = query(colRef, orderBy("order", "desc"));
  const postSnapshot = await getDocs(q);
  const postList = postSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IPost[];
  if (!postList) throw Error;

  return postList;
}

export async function getPostById(id: string): Promise<IPost | null> {
  try {
    const docRef = doc(db, "posts", id);
    const postDoc = await getDoc(docRef);

    if (postDoc.exists()) {
      return postDoc.data() as IPost;
    } else {
      console.log("Post does not exist");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch post data:", error);
    throw new Error("Failed to fetch post data");
  }
}

export const likePost = async (post: string, likesArray: string[]) => {
  const postRef = doc(db, "posts", post);
  await updateDoc(postRef, {
    likes: likesArray,
  }).catch((error) => {
    console.log(error);
  });
  return post;
};

export const SavePost = async (userId: string, PostsArray: string[]) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    savedPosts: PostsArray,
  }).catch((error) => {
    console.log(error);
  });
  return userId;
};

export const createPost = async (postData: ICreatePost) => {
  try {
    const postsCollectionRef = collection(db, "posts");

    const newPost = await addDoc(postsCollectionRef, {
      ...postData,
      order: orderByDate(),
    });
    return newPost;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to create post");
  }
};

export async function getPostsByUser(userId: string) {
  const colRef = collection(db, "posts");
  const q = query(
    colRef,
    orderBy("order", "desc"),
    where("uploadedBy", "==", userId)
  );
  const postSnapshot = await getDocs(q);
  const postList = postSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IPost[];
  if (!postList) throw Error;

  return postList;
}

// News

export const getRecentNews = async (filter?: string): Promise<INewses[]> => {
  const baseQuery = collection(db, "news");
  let newsQuery;

  if (filter) {
    newsQuery = query(
      baseQuery,
      where("type", "==", filter),
      orderBy("date", "desc"),
      limit(30)
    );
  } else {
    newsQuery = query(baseQuery, orderBy("date", "desc"), limit(30));
  }

  const newsSnapshot = await getDocs(newsQuery);
  const newsList = newsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as INewses[];

  return newsList;
};

export const likeNews = async (newsId: string, likesArray: string[]) => {
  const newsRef = doc(db, "news", newsId);
  await updateDoc(newsRef, {
    likes: likesArray,
  }).catch((error) => {
    console.log(error);
  });
  return newsId;
};

export async function getNewsById(id: string): Promise<any> {
  try {
    const docRef = doc(db, "news", id);
    const newsDoc = await getDoc(docRef);

    if (newsDoc.exists()) {
      return newsDoc.data();
    } else {
      console.log("News does not exist");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch News data:", error);
    throw new Error("Failed to fetch News data");
  }
}

// Book

export const fetchDataTableNews = async (): Promise<INewsDataTable[]> => {
  const q = query(collection(db, "news"), orderBy("date", "desc"), limit(100));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<INewsDataTable, "id">),
  }));
};

export const fetchBooks = async (): Promise<IBooks[]> => {
  const booksCollection = collection(db, "books");
  const booksSnapshot = await getDocs(booksCollection);
  const booksList = booksSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IBooks[];
  return booksList;
};

export const fetchDataTableBook = async (): Promise<IBookDataTable[]> => {
  const q = query(collection(db, "books"), limit(100));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<IBookDataTable, "id">),
  }));
};

export async function getBook(id: string): Promise<any> {
  try {
    const docRef = doc(db, "books", id);
    const bookDoc = await getDoc(docRef);

    if (bookDoc.exists()) {
      return bookDoc.data();
    } else {
      console.log("Book does not exist");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch book data:", error);
    throw new Error("Failed to fetch book data");
  }
}

export const likeBook = async (bookId: string, userId: string) => {
  const bookRef = doc(db, "books", bookId);
  await updateDoc(bookRef, {
    likes: arrayUnion(userId),
  }).catch((error) => {
    console.log(error);
  });
};

export const unlikeBook = async (bookId: string, userId: string) => {
  const bookRef = doc(db, "books", bookId);
  await updateDoc(bookRef, {
    likes: arrayRemove(userId),
  }).catch((error) => {
    console.log(error);
  });
};

export const uploadImages = async (
  imageBlobs: Blob[],
  folderPath: string
): Promise<{ url: string; path: string }[]> => {
  const uploadPromises = imageBlobs.map(async (blob, index) => {
    const fileName = `image_${Date.now()}_${index}`;
    const storageRef = ref(storage, `${folderPath}/${fileName}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return { url: downloadURL, path: storageRef.fullPath };
  });

  return Promise.all(uploadPromises);
};

export const deleteFiles = async (filePaths: string[]): Promise<void[]> => {
  const deletePromises = filePaths.map((path) => {
    const fileRef = ref(storage, path);
    return deleteObject(fileRef);
  });

  try {
    return await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
};

export const deleteDocumentWithFiles = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      if (docData.imagesPath && Array.isArray(docData.imagesPath)) {
        await deleteFiles(docData.imagesPath);
        console.log("Files deleted successfully");
      }

      await deleteDoc(docRef);
      console.log(
        `Document with ID ${docId} from collection ${collectionName} deleted successfully.`
      );
    } else {
      console.log("No such document found!");
    }
  } catch (error) {
    console.error("Error deleting document and files:", error);
    throw error;
  }
};
