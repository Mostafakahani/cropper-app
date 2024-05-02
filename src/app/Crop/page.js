"use client";
import getCroppedImg from "@/Componenets/cropImage/cropImage";
import { useState, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";

export default function Demo() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [initialCroppedArea, setInitialCroppedArea] = useState(undefined);
  const [zoom, setZoom] = useState(1);
  const [route, setRoute] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const imageRef = useRef(null);
  const [url, setUrl] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const croppedArea = JSON.parse(window.localStorage.getItem("croppedArea"));
    setInitialCroppedArea(croppedArea);
  }, []);

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, route);

      // Extracting URL and removing "blob:" part
      //   const url = croppedImage.replace("blob:", "");
      setUrl(croppedImage);
      setCroppedAreaPixels(croppedImage);
      window.localStorage.setItem("croppedArea", JSON.stringify(croppedArea));
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleZoomChange = (e) => {
    setZoom(parseFloat(e.target.value));
  };
  const handleRouteChange = (e) => {
    setRoute(parseFloat(e.target.value));
  };

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        // Create cropped image
        // const croppedImageBlobUrl = await getCroppedImg(
        //   image,
        //   croppedAreaPixels
        // );

        // Create a temporary link element
        const link = document.createElement("a");
        link.download = "cropped-image.jpg";
        link.href = url;
        link.click();
      }
    } catch (error) {
      console.error("Error saving cropped image:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center items-center h-40">
        <input
          type="file"
          id="avatarInput"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <div className="">
          <button className="w-fit shadow mb-4 hover:shadow-lg p-4 rounded-md transition-all">
            <label htmlFor="avatarInput">Upload Another Picture</label>
          </button>
        </div>
      </div>

      <div className="flex justify-center flex-grow">
        <div className="relative w-full">
          {image && (
            <Cropper
              image={image || ""}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              initialCroppedAreaPercentages={initialCroppedArea}
              ref={imageRef}
              showGrid={true}
              cropSize={{ width: 185, height: 185 }}
              rotation={route}
              style={{
                containerStyle: {
                  minHeight: 300,
                  minWidth: 300,
                  width: 400,
                  height: 400,
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                },
                cropAreaStyle: {
                  borderRadius: 1,
                },
              }}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <div className="w-2/4">
          <div>
            Zoom:
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={handleZoomChange}
              className="w-full"
            />
          </div>
          <div>
            Rotation:
            <input
              type="range"
              min="1"
              max="360"
              step="1"
              aria-labelledby="Rotation"
              value={route}
              onChange={handleRouteChange}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-end w-2/4 items-center">
          <button
            onClick={handleSave}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded text-sm sm:text-md"
          >
            Save to Computer
          </button>
        </div>
      </div>
    </div>
  );
}
