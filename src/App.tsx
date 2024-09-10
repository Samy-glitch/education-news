import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./globals.css";
import "./medium-image-zoom.css";
import "katex/dist/katex.min.css";
import {
  Landing,
  Home,
  News,
  Books,
  Other,
  Profile,
  UpdateProfile,
  NewsDetails,
  AdminMain,
  Settings,
  Orders,
  CreatePost,
  Search,
  Book,
  AddNews,
  NewsTable,
  AddBook,
  BookTable,
  FallBackPage,
  Post,
  EditPost,
  PostTable,
  Message,
} from "./_root/pages";
import SetUsername from "./_auth/forms/SetUsername";
import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import AdminLayout from "./_root/pages/admin/adminLayout";
import AuthOnlyLayout from "./_root/AuthOnlyLayout";
import Test from "./Test";

const App = () => {
  useEffect(() => {
    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }
  }, []);

  return (
    <>
      <div className="flex h-screen">
        <Routes>
          <Route index element={<Landing />} />
          <Route path="*" element={<FallBackPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/set-username" element={<SetUsername />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
          </Route>
          <Route element={<RootLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/news-details/:id" element={<NewsDetails />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/books" element={<Books />} />
            <Route path="/book/:id" element={<Book />} />
            <Route path="/other" element={<Other />} />
            <Route path="/profile/:id/*" element={<Profile />} />
            <Route path="/edit-profile/:id" element={<UpdateProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/search" element={<Search />} />
            <Route element={<AuthOnlyLayout />}>
              <Route path="/message" element={<Message />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/edit-post/:id" element={<EditPost />} />
            </Route>
            <Route element={<AdminLayout />}>
              <Route path="/test" element={<Test />} />
              <Route path="/admin" element={<AdminMain />} />
              <Route path="/admin/add-news" element={<AddNews />} />
              <Route path="/admin/add-book" element={<AddBook />} />
              <Route path="/admin/data-table/news" element={<NewsTable />} />
              <Route path="/admin/data-table/posts" element={<PostTable />} />
              <Route path="/admin/data-table/book" element={<BookTable />} />
            </Route>
          </Route>
        </Routes>
      </div>
      <Toaster />
    </>
  );
};

export default App;
