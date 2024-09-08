import { IBooks } from "@/types";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

export const BookCard = ({ book }: { book: IBooks }) => {
  function convertToClass(input: string): string {
    if (input.startsWith("c") && input.length < 4) {
      const classNumber = input.slice(1);
      return `Class ${classNumber}`;
    } else {
      return input;
    }
  }

  return (
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
  );
};
