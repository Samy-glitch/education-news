import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import MathExtension from "@aarkue/tiptap-math-extension";
import {
  DividerHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  ImageIcon,
  Link2Icon,
  QuoteIcon,
  StrikethroughIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextIcon,
  TextNoneIcon,
} from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import {
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Redo2,
  Undo2,
  YoutubeIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import LinkDialog from "./LinkDialog";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogInitialUrl, setDialogInitialUrl] = useState<string>("");
  const [dialogType, setDialogType] = useState<"link" | "image" | "video">(
    "link"
  );
  const [dialogLable, setDialogLable] = useState<string>("");

  const setLink = useCallback(() => {
    setDialogType("link");
    setDialogLable("Add Link");
    const previousUrl = editor.getAttributes("link").href;
    setDialogInitialUrl(previousUrl);
    setDialogOpen(true);
  }, [editor]);

  const setImage = useCallback(() => {
    setDialogType("image");
    setDialogLable("Add Image");
    setDialogInitialUrl("");
    setDialogOpen(true);
  }, [editor]);

  const setVideo = useCallback(() => {
    setDialogType("video");
    setDialogLable("Add Youtube video");
    setDialogInitialUrl("");
    setDialogOpen(true);
  }, [editor]);

  const handleDialogSubmit = (url: string) => {
    if (dialogType === "link") {
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } else if (dialogType === "image") {
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } else if (dialogType === "video") {
      if (url) {
        editor.commands.setYoutubeVideo({
          src: url,
        });
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="tiptap-group">
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().toggleBold().run();
            }}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <FontBoldIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().toggleItalic().run();
            }}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <FontItalicIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().toggleStrike().run();
            }}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <StrikethroughIcon className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().clearNodes().run();
            }}
          >
            <TextNoneIcon className="h-4 w-4" />
          </button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().toggleBlockquote().run();
            }}
            className={editor.isActive("blockquote") ? "is-active" : ""}
          >
            <QuoteIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().toggleHighlight().run();
            }}
            className={editor.isActive("highlight") ? "is-active" : ""}
          >
            <Highlighter className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().setHorizontalRule().run();
            }}
          >
            <DividerHorizontalIcon className="h-4 w-4" />
          </button>
        </div>
        <Separator orientation="vertical" className="h-8 hidden md:block" />
        <Separator className="my-1 md:hidden" />
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().setParagraph().run();
            }}
            className={editor.isActive("paragraph") ? "is-active" : ""}
          >
            <TextIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e),
                editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e),
                editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e),
                editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
          >
            <Heading3 className="h-4 w-4" />
          </button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              handleClick(e), setLink();
            }}
            className={editor.isActive("link") ? "is-active" : ""}
          >
            <Link2Icon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e), setImage();
            }}
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e), setVideo();
            }}
          >
            <YoutubeIcon className="h-4 w-4" />
          </button>
        </div>
        <Separator orientation="vertical" className="h-8 hidden md:block" />
        <Separator className="my-1 md:hidden" />
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().setTextAlign("left").run();
            }}
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
          >
            <TextAlignLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e),
                editor.chain().focus().setTextAlign("center").run();
            }}
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
          >
            <TextAlignCenterIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e),
                editor.chain().focus().setTextAlign("right").run();
            }}
            className={
              editor.isActive({ textAlign: "right" }) ? "is-active" : ""
            }
          >
            <TextAlignRightIcon className="h-4 w-4" />
          </button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="ml-auto flex gap-1">
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().undo().run();
            }}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              handleClick(e), editor.chain().focus().redo().run();
            }}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <LinkDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        initialUrl={dialogInitialUrl}
        label={dialogLable}
      />
    </>
  );
};

const content = ``;

type IsetFunction = (setContent: string) => void;

const TipTap = ({
  setContent,
  setDescription,
  placeholder,
}: {
  setContent: IsetFunction;
  setDescription?: IsetFunction;
  placeholder?: string;
}) => {
  const extensions = [
    MathExtension.configure({ evaluation: true }),
    Highlight.configure({
      HTMLAttributes: {
        class: "bg-blue-500 text-white",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Placeholder.configure({
      placeholder: placeholder,
    }),
    Youtube.configure({
      width: 560,
      height: 340,
    }),
    StarterKit,
    Image,
    Link,
  ];

  return (
    <div className="tiptap-content rounded-b-lg">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => {
          setContent(String(editor.getHTML()));
          if (setDescription) {
            setDescription(String(editor.getText()));
          }
        }}
      ></EditorProvider>
    </div>
  );
};

export default TipTap;
