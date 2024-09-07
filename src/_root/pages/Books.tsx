import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useGetBooks } from "@/lib/react-query/queriesAndMutations";

const Books = () => {
  const [classFilter, setClassFilter] = useState("");
  const [bookTypeFilter, setBookTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const skeletonItems = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
  }));

  const { data: books, isLoading, error } = useGetBooks();

  const filteredBooks = books?.filter((book) => {
    const matchesClass = classFilter === "" || book.class === classFilter;
    const matchesType = bookTypeFilter === "" || book.type === bookTypeFilter;
    const bookQurys =
      book.name + book.description + book.tags + book.class + book.type;
    const matchesSearch = bookQurys
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesClass && matchesType && matchesSearch;
  });

  function convertToClass(input: string): string {
    if (input.startsWith("c") && input.length < 4) {
      const classNumber = input.slice(1);
      return `Class ${classNumber}`;
    } else {
      return input;
    }
  }

  return (
    <div>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Books</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Buy or read books online.
        </p>
      </div>
      <Separator className="my-6" />
      <div>
        <div className="flex justify-between gap-2 md:w-fit">
          <Input
            type="text"
            placeholder="Search books..."
            className="md:min-w-[330px] lg:min-w-[400px] max-w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLoading}>
              <Button variant="outline" className="min-w-[91px] ">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM8 10.5C8 9.67157 8.67157 9 9.5 9C10.3284 9 11 9.67157 11 10.5C11 11.3284 10.3284 12 9.5 12C8.67157 12 8 11.3284 8 10.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>{" "}
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Class</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={classFilter}
                onValueChange={setClassFilter}
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="c6">
                  Class 6
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="c7">
                  Class 7
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="c8">
                  Class 8
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="c9">
                  Class 9
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="c10">
                  Class 10
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="c11">
                  Class 11
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="c12">
                  Class 12
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={bookTypeFilter}
                onValueChange={setBookTypeFilter}
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="book">Book</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="guide">
                  Guide
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="box-border mt-4 overflow-visible">
          {isLoading ? (
            skeletonItems.map((item) => (
              <div
                key={item.id}
                className="w-[45%] md:w-[25%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%] px-2 float-left overflow-visible mb-6 mr-4 relative"
              >
                <div className="overflow-hidden relative rounded-md shadow-md transition-all duration-300">
                  <div className="w-full pb-[140%] relative">
                    <Skeleton className="h-full w-full absolute rounded-md" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-[80%] h-4" />
                </div>
                <Skeleton className="absolute -top-2 right-0 w-[67px] h-[22px] rounded-md shadow-md" />
                <Skeleton className="absolute top-[18px] -right-4 w-[56px] h-[22px] rounded-md shadow-md" />
                <div className="book-element-bg" />
              </div>
            ))
          ) : !filteredBooks || error ? (
            <div className="h-[50vh] w-full flex items-center justify-center">
              <p className="text-muted-foreground">
                No books found. Please check your internet connection.
              </p>
            </div>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="w-[45%] md:w-[25%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%] px-2 float-left overflow-visible mb-6 mr-4 relative group book-element-group"
              >
                <Link to={`/book/${book.id}`}>
                  <div className="overflow-hidden relative rounded-md shadow-md transition-all duration-300 group-hover:translate-x-4 group-hover:scale-110">
                    <div className="w-full pb-[140%] relative">
                      <img
                        src={book.image}
                        alt="book cover"
                        className="h-full w-full absolute rounded-md"
                      />
                    </div>
                    <div className="absolute px-2 pt-1 pb-2 -bottom-1 -right-1 bg-muted/90 shadow-md rounded-md text-sm">
                      {book.price} ৳
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm md:text-base line-clamp-2 overflow-hidden h-10 md:h-14 max-h-12 mt-2">
                    {book.name}
                  </p>
                </Link>
                <Badge className="book-element-bage-1">
                  {convertToClass(book.class)}
                </Badge>
                <Badge variant="secondary" className="book-element-bage-2">
                  {book.type}
                </Badge>
                <div className="book-element-bg" />
              </div>
            ))
          ) : (
            <div className="h-[50vh] w-full flex items-center justify-center">
              <p className="text-muted-foreground">No books found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
