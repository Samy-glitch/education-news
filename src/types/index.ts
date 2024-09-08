import { Timestamp } from "firebase/firestore";

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
  route: string;
  label: string;
  svg: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewses = {
  id: string;
  date: Timestamp;
  description: string;
  image: string;
  linkTitle: string;
  link: string;
  title: string;
  type: string;
  tags: string;
  likes: string[];
};

export type INews = {
  date: Timestamp;
  description: string;
  content: string;
  image: string;
  images: string[];
  imagesPath: string[];
  link: string;
  linkTitle: string;
  title: string;
  type: string;
  tags: string;
  likes: string[];
  uploadedBy: string;
};

export type INewsDataTable = {
  id: string;
  date: Timestamp;
  description: string;
  type: string;
};

export type IBooks = {
  id: string;
  type: string;
  name: string;
  image: string;
  tags: string;
  price: string;
  class: string;
  link: string;
  description: string;
};

export type IBook = {
  id: string;
  type: string;
  name: string;
  image: string;
  images: string[];
  tags: string;
  price: string;
  class: string;
  by: string;
  link: string;
  likes: string[];
  shipping: number;
  description: string;
};

export type IBookDataTable = {
  id: string;
  type: string;
  name: string;
  by: string;
  price: string;
  class: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  date: string;
  badges: Array<string>;
  isAadmin: boolean;
};

export type IUploder = {
  uid: string;
  displayName: string;
  userName: string;
  email: string;
  photoURL: string;
  badges: string[];
  isAadmin: boolean;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IQnA = {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  images: string[];
  imagesPath: string[];
  tags: string[];
  isAnswered: boolean;
  likes: string[];
  date: Timestamp;
  uploadedBy: string;
};
