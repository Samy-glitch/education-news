import * as React from "react";
import {
  CopyIcon,
  DotsHorizontalIcon,
  IdCardIcon,
  MixerHorizontalIcon,
  Pencil2Icon,
  PersonIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, getInitials } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTablePagination } from "@/components/data-table/pagination";
import { Separator } from "@/components/ui/separator";
import LagrgeScreenOnly from "@/components/shared/LagrgeScreenOnly";
import { Link, useNavigate } from "react-router-dom";
import { IPost } from "@/types";
import {
  useGetRecentPosts,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteDialog } from "@/components/shared/Dialogs";
import { toast } from "@/components/ui/use-toast";

export const columns: ColumnDef<IPost>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "uploadedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="By" />
    ),

    cell: ({ row }) => {
      const { data: uploader } = useGetUserById(row.getValue("uploadedBy"));
      return (
        <div className="flex gap-2 items-center">
          <Link to={`/profile.${uploader?.uid}`}>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full border">
              <AvatarImage src={uploader?.photoURL} alt="Avatar" />
              <AvatarFallback>
                {getInitials(String(uploader?.displayName))}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="max-w-[150px] truncate font-medium font-onest">
            {uploader?.displayName}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue("title")}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content" />
    ),

    cell: ({ row }) => {
      return (
        <div className="max-w-[100px] lg:max-w-[270px] xl:max-w-[450px] 2xl:max-w-[550px] truncate font-medium">
          {row.getValue("description")}
        </div>
      );
    },
  },

  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date");
      const formattedDate = formatDate(date as Timestamp);

      return <div className="font-medium">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const post = row.original;
      const navigate = useNavigate();
      const [deletePreview, setDeletePreview] = React.useState<boolean>(false);
      return (
        <>
          <DeleteDialog
            open={deletePreview}
            onOpenChange={setDeletePreview}
            collection="posts"
            docId={post.id}
            deleteType="Post"
            onSuccess={() => {
              setDeletePreview(false);
              toast({
                title: "Post deleted successfully",
              });
            }}
          />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/edit-post/${post.id}`)}
              >
                <Pencil2Icon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(post.id)}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                <span>Copy ID</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/profile/${post.uploadedBy}`)}
              >
                <PersonIcon className="mr-2 h-4 w-4" />
                <span>Uploader profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/post/${post.id}`)}>
                <IdCardIcon className="mr-2 h-4 w-4" />
                <span>View post details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="!text-rose-800 font-semibold"
                onClick={() => setDeletePreview(true)}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default function DataTableDemo() {
  const { data, isLoading, isError } = useGetRecentPosts();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm md:text-base">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm md:text-base">
        Error: Somthing went wrong!
      </div>
    );
  }

  return (
    <div className="w-full">
      <LagrgeScreenOnly />
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Post data-table.</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          A post data table allows admins to change and delete data.
        </p>
        <Separator className="!my-4" />
      </div>
      <div></div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter post..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
            >
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
