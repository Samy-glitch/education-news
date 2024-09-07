import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface LinkDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
  label?: string;
}

const LinkDialog: React.FC<LinkDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialUrl = "",
  label,
}) => {
  const [url, setUrl] = useState(initialUrl);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onSubmit(url);
    setUrl("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor="URL">Input URL</Label>
          <Input
            id="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="default">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
