import { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";

export const DishCamera = ({ setNewRecipe, newRecipe }) => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [cameraToggle, setCameraToggle] = useState(true);
  const [facingMode, setFacingMode] = useState("environment");
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  const navigate = useNavigate();

  function base64ToPng(base64String) {
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });

    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject("Error occurred while reading the file.");
      };
    });
  }

  const handleTakePhoto = async () => {
    const photo = camera.current.takePhoto();
    const pngPhoto = await base64ToPng(photo);
    setImage(pngPhoto);
    setCameraToggle(false);
  };

  const saveToLocalStorage = () => {
    const updatedRecipe = { ...newRecipe, photo: image };
    localStorage.setItem("newRecipe", JSON.stringify(updatedRecipe));
  };

  const toggleFacingMode = () => {
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileOrTablet(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "500px", height: "500px" }} className="ml-[35%] mt-14 bg-[#FFDAB9] bg-opacity-90 backdrop-blur-md p-4  rounded-xl shadow-2xl w-full max-w-lg">
      {cameraToggle && (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Camera
            key={facingMode}
            ref={camera}
            aspectRatio={1}
            facingMode={facingMode}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
      {!cameraToggle && (
        <div>
          <img src={image} style={{ width: "100%", height: "100%" }} />
          <button
            onClick={() => {
              setNewRecipe((prevRecipe) => ({
                ...prevRecipe,
                photo: image,
              }));
              navigate("/recipe_form");
              saveToLocalStorage();
            }}
          className="bg-emerald-500 hover:bg-emerald-600 rounded-md px-4 py-2 shadow-md w-full mt-4 text-white">
            Confirm
          </button>
          <button onClick={() => setCameraToggle(true)} className="text-blue-600 px-4 py-2 ml-[180px] pt-0 ">Retake</button>
        </div>
      )}
      {cameraToggle && (
        <>
          <button
            onClick={handleTakePhoto}
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "20px",
              padding: "10px 20px",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PhotoCameraIcon style={{ fontSize: "40px" }} />
            {/* {isMobileOrTablet && (
              <span style={{ fontSize: "14px" }}>Switch</span>
            )} */}
          </button>
          {isMobileOrTablet && (
            <button
              onClick={toggleFacingMode}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                fontSize: "20px",
                padding: "10px 20px",
                zIndex: 100,
              }}
            >
              <CameraswitchIcon />
            </button>
          )}
        </>
      )}
    </div>
  );
};
