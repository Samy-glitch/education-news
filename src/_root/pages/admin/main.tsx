import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileTextIcon } from "@radix-ui/react-icons";
import { Bug, Settings, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Other = () => {
  return (
    <>
      <Card className="p-0 border-0 md:p-6 md:border">
        <CardHeader className="p-4 md:p-6">
          <CardTitle>Admin options</CardTitle>
          <CardDescription>Site configurations for admins.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:mt-0 grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          <Link
            to="/admin/add-news"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-foreground w-5 h-5"
            >
              <path
                fill="inherit"
                d="M21.9,12.7c0-1.1-0.8-2-1.9-2.2c-0.5-0.1-1-0.1-1.6-0.1c0.1-1.3,0.2-2.6,0.3-3.9l0.1-0.7c0.1-1.2-0.8-2.3-2-2.4
	C12.7,3,8.1,3.1,4.8,3.7C3.9,3.8,3.2,4.5,3,5.4c-0.2,0.8-1.6,7.8-0.6,12c0.4,1.6,1.6,2.7,3.2,3c1.7,0.3,3.8,0.4,5.9,0.4
	c1.9,0,4-0.1,6-0.4c0.5-0.1,1.9-0.4,2.1-0.4c0,0,0,0,0,0c0,0,0,0,0,0C21.3,19.7,22,17.4,21.9,12.7z M6.4,7.9c2.4-0.5,5.3-0.5,7.6,0
	c0.4,0.1,0.7,0.5,0.6,0.9c-0.1,0.4-0.4,0.6-0.7,0.6c0,0-0.1,0-0.1,0c-2.2-0.4-4.8-0.4-7.1,0C6.3,9.5,5.9,9.2,5.8,8.8
	C5.7,8.4,6,8,6.4,7.9z M14,16c-1.2,0.2-2.5,0.3-3.8,0.3c-1.3,0-2.6-0.1-3.8-0.3C6,16,5.7,15.6,5.8,15.2c0.1-0.4,0.5-0.7,0.9-0.6
	c2.2,0.4,4.8,0.4,7.1,0c0.4-0.1,0.8,0.2,0.9,0.6C14.7,15.6,14.4,16,14,16z M13.9,12.7c-1.2,0-2.5,0-3.7,0c-1.3,0-2.5,0-3.7,0
	c-0.4,0-0.7-0.3-0.7-0.7c0-0.4,0.3-0.7,0.7-0.7h7.4c0.4,0,0.7,0.3,0.7,0.7C14.6,12.3,14.3,12.7,13.9,12.7z M19.4,18.6
	C19.3,18.6,19.3,18.6,19.4,18.6C19.3,18.6,19.3,18.6,19.4,18.6c-0.1,0-0.2,0-0.3-0.1c-0.2-0.2-0.4-0.6-0.5-1.1
	c-0.2-1.3-0.3-3.1-0.2-5.5c0.6,0,1.1,0,1.5,0.1c0.3,0,0.6,0.4,0.6,0.7C20.5,18,19.6,18.5,19.4,18.6z"
              ></path>
            </svg>
            <span>Add News</span>
          </Link>
          <Link
            to="/admin/add-book"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-foreground w-5 h-5"
            >
              <path
                fill="inherit"
                d="M18,2H8C5.8,2,4,3.8,4,6v12c0,2.2,1.8,4,4,4h10c1.1,0,2-0.9,2-2V4C20,2.9,19.1,2,18,2z M10,6h4c0.6,0,1,0.4,1,1s-0.4,1-1,1  h-4C9.4,8,9,7.6,9,7S9.4,6,10,6z M18,20H8c-1.1,0-2-0.9-2-2s0.9-2,2-2h10V20z"
              ></path>
            </svg>
            <span>Add Book</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              <path d="M8 12h.01" />
              <path d="M12 12h.01" />
              <path d="M16 12h.01" />
            </svg>
            <span>Feedbacks</span>
          </Link>
          <Link
            to="/admin/feedback"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <Bug className="w-5 h-5" />
            <span>Issus</span>
          </Link>
        </CardContent>
      </Card>
      <Card className="p-0 border-0 md:p-6 md:border mt-8">
        <CardHeader className="p-4 md:p-6">
          <CardTitle>Data table</CardTitle>
          <CardDescription>Data configurations for admins.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:mt-0 grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          <Link
            to="/admin/data-table/posts"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <FileTextIcon className="w-5 h-5" />
            <span>Posts</span>
          </Link>
          <Link
            to="/admin/data-table/news"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-foreground w-5 h-5"
            >
              <path
                fill="inherit"
                d="M21.9,12.7c0-1.1-0.8-2-1.9-2.2c-0.5-0.1-1-0.1-1.6-0.1c0.1-1.3,0.2-2.6,0.3-3.9l0.1-0.7c0.1-1.2-0.8-2.3-2-2.4
	C12.7,3,8.1,3.1,4.8,3.7C3.9,3.8,3.2,4.5,3,5.4c-0.2,0.8-1.6,7.8-0.6,12c0.4,1.6,1.6,2.7,3.2,3c1.7,0.3,3.8,0.4,5.9,0.4
	c1.9,0,4-0.1,6-0.4c0.5-0.1,1.9-0.4,2.1-0.4c0,0,0,0,0,0c0,0,0,0,0,0C21.3,19.7,22,17.4,21.9,12.7z M6.4,7.9c2.4-0.5,5.3-0.5,7.6,0
	c0.4,0.1,0.7,0.5,0.6,0.9c-0.1,0.4-0.4,0.6-0.7,0.6c0,0-0.1,0-0.1,0c-2.2-0.4-4.8-0.4-7.1,0C6.3,9.5,5.9,9.2,5.8,8.8
	C5.7,8.4,6,8,6.4,7.9z M14,16c-1.2,0.2-2.5,0.3-3.8,0.3c-1.3,0-2.6-0.1-3.8-0.3C6,16,5.7,15.6,5.8,15.2c0.1-0.4,0.5-0.7,0.9-0.6
	c2.2,0.4,4.8,0.4,7.1,0c0.4-0.1,0.8,0.2,0.9,0.6C14.7,15.6,14.4,16,14,16z M13.9,12.7c-1.2,0-2.5,0-3.7,0c-1.3,0-2.5,0-3.7,0
	c-0.4,0-0.7-0.3-0.7-0.7c0-0.4,0.3-0.7,0.7-0.7h7.4c0.4,0,0.7,0.3,0.7,0.7C14.6,12.3,14.3,12.7,13.9,12.7z M19.4,18.6
	C19.3,18.6,19.3,18.6,19.4,18.6C19.3,18.6,19.3,18.6,19.4,18.6c-0.1,0-0.2,0-0.3-0.1c-0.2-0.2-0.4-0.6-0.5-1.1
	c-0.2-1.3-0.3-3.1-0.2-5.5c0.6,0,1.1,0,1.5,0.1c0.3,0,0.6,0.4,0.6,0.7C20.5,18,19.6,18.5,19.4,18.6z"
              ></path>
            </svg>
            <span>News</span>
          </Link>
          <Link
            to="/admin/data-table/book"
            className="flex items-center justify-start w-full p-4 space-x-2 border transition-colors hover:bg-muted rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-foreground w-5 h-5"
            >
              <path
                fill="inherit"
                d="M18,2H8C5.8,2,4,3.8,4,6v12c0,2.2,1.8,4,4,4h10c1.1,0,2-0.9,2-2V4C20,2.9,19.1,2,18,2z M10,6h4c0.6,0,1,0.4,1,1s-0.4,1-1,1  h-4C9.4,8,9,7.6,9,7S9.4,6,10,6z M18,20H8c-1.1,0-2-0.9-2-2s0.9-2,2-2h10V20z"
              ></path>
            </svg>
            Book
          </Link>
        </CardContent>
      </Card>
    </>
  );
};

export default Other;
