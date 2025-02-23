import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { QRCode } from "react-qrcode-logo";
import { useNavigate } from "react-router-dom";
import { useDeleteDocumentWithFiles } from "@/lib/react-query/queriesAndMutations";
import { useState } from "react";
import { Icons } from "./ui/icons";

export const DiscardDialog = ({
  open,
  onOpenChange,
  discardFunction,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  discardFunction: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discard changes?</DialogTitle>
          <DialogDescription>
            This can’t be undone and you’ll lose your changes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="mt-4 md:mt-0" type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={discardFunction}>
            Discard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteDialog = ({
  open,
  onOpenChange,
  collection,
  deleteType,
  docId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  collection: string;
  deleteType: string;
  docId: string;
  onSuccess: () => void;
}) => {
  const deleteDocMutation = useDeleteDocumentWithFiles(collection);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    if (docId === "") {
      return;
    }
    setIsLoading(true);
    deleteDocMutation.mutate(docId, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (error) => {
        console.error("Failed to delete document and files:", error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {deleteType}?</DialogTitle>
          <DialogDescription>
            This can’t be undone and you’ll lose your changes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="mt-4 md:mt-0" type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const LoginDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You will need to log in.</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="mt-4 md:mt-0" type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={() => navigate("/sign-in")}>
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const QRCodeDialog = ({
  open,
  onOpenChange,
  link,
}: {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  link: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code on another device to get to this link.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex items-center justify-center">
          <div className="rounded">
            <QRCode
              value={link}
              size={350}
              logoImage="/assets/icons/education-news-light-bg-02-01.png"
              logoHeight={40}
              logoWidth={40}
              logoOpacity={1}
              enableCORS={true}
              eyeRadius={4}
              id={"QR"}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild className="w-full">
            <Button type="button" className="w-fit ml-auto mt-4">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
