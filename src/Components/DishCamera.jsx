import { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";

export const DishCamera = ({ setNewRecipe, newRecipe }) => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [cameraToggle, setCameraToggle] = useState(true);
  const [facingMode, setFacingMode] = useState("environment");

  const navigate = useNavigate();

  function base64ToPng(base64String) {
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });

    // Convert blob to base64 data URL
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result); // This is the base64 PNG data URL
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

  return (
    <div style={{ position: "relative", width: "300px", height: "300px" }}>
      {cameraToggle && (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Camera
            key={facingMode} // Force re-render when facingMode changes
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
          >
            Check
          </button>
          <button onClick={() => setCameraToggle(true)}>Retake</button>
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
            }}
          >
            Take photo
          </button>
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
            Switch Camera
          </button>
        </>
      )}
    </div>
  );
};
