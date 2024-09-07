import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import ImageCropper from "./ImageCropper";
import { Slider } from "../ui/slider";

type SetImageUrlFunction = (url: string | Blob) => void;
type BooleanFunction = (preview: boolean) => void;
const MIN_WIDTH = 150;

const ImageUploader = ({
  setImageUrl,
  setImagePreview,
  setIsImageChanged,
}: {
  setImageUrl: SetImageUrlFunction;
  setImagePreview: BooleanFunction;
  setIsImageChanged: BooleanFunction;
}) => {
  const [error, setError] = useState<string>("");
  const [localImage, setLocalImage] = useState<string>("");
  const [zoom, setZoom] = useState<number>(1);
  const [croppedImage, setCroppedImage] = useState<Blob>();
  const [rotation, setRotation] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result?.toString() || "";
      const imageElement = new Image();
      imageElement.src = imageUrl;

      imageElement.onload = (e) => {
        const { naturalWidth, naturalHeight } =
          e.currentTarget as HTMLImageElement;
        if (naturalHeight < MIN_WIDTH || naturalWidth < MIN_WIDTH) {
          setError("Image must be at least 150 x 150 pixels.");
          setLocalImage("");
        } else {
          setError("");
          setLocalImage(imageUrl);
        }
      };
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  return (
    <div className="pt-6">
      <div
        {...getRootProps()}
        className={`border-dashed border-2 p-6 rounded-lg cursor-pointer mb-2 outline-none flex flex-col items-center justify-center gap-8 py-8 ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        } ${localImage && "hidden"}`}
      >
        <input {...getInputProps()} />
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 48 48"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          role="presentation"
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-9 flex-shrink-0 lg:h-6 lg:w-6"
        >
          <path
            d="M44 24a2 2 0 1 0-4 0h4ZM24 8a2 2 0 1 0 0-4v4Zm15 32H9v4h30v-4ZM8 39V9H4v30h4Zm32-15v15h4V24h-4ZM9 8h15V4H9v4Zm0 32a1 1 0 0 1-1-1H4a5 5 0 0 0 5 5v-4Zm30 4a5 5 0 0 0 5-5h-4a1 1 0 0 1-1 1v4ZM8 9a1 1 0 0 1 1-1V4a5 5 0 0 0-5 5h4Z"
            data-follow-fill="currentColor"
            fill="currentColor"
          ></path>
          <path
            stroke-width="4"
            d="m6 35 10.693-9.802a2 2 0 0 1 2.653-.044L32 36m-4-5 4.773-4.773a2 2 0 0 1 2.615-.186L42 31M30 12h12m-6-6v12"
            data-follow-stroke="currentColor"
            stroke="currentColor"
          ></path>
        </svg>
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {error && <p className="text-red font-bold">{error}</p>}
      {localImage && (
        <div className="flex flex-col items-center">
          <ImageCropper
            zoom={zoom}
            onZoomChange={setZoom}
            rotation={rotation}
            onRotationChange={setRotation}
            source={localImage}
            onCrop={setCroppedImage}
            width={300}
            height={300}
            className=""
            cropShape="round"
          />

          <div className="flex flex-col w-full mt-6">
            <p>Zoom</p>
            <Slider
              className="my-4"
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
            />
          </div>
          <div className="flex flex-col w-full mt-4">
            <p>Rotation</p>
            <Slider
              className="my-4"
              min={0}
              max={360}
              step={0.1}
              value={[rotation]}
              onValueChange={([value]) => setRotation(value)}
            />
          </div>
        </div>
      )}
      <div className="mt-4 flex gap-2 items-center">
        <DialogClose asChild>
          <Button className="ml-auto" type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button
          className={`${!localImage && "hidden"}`}
          onClick={() => {
            if (croppedImage) {
              setImageUrl(croppedImage);
              setImagePreview(false);
              setIsImageChanged(true);
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
