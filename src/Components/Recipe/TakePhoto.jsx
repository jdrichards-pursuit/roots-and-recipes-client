import { Camera } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useState } from "react";
import ImagetoText from "./ImagetoText";

const TakePhoto = () => {
  // const [dataUri, setDataUri] = useState('');
  const [image, setImage] = useState("");
  const [photoUpload, setPhotoUpload] = useState("");
  const [imageURL, setImageURL] = useState("");

  function handleTakePhotoAnimationDone(dataUri) {
    setImageURL("");
    setImage(dataUri);
  }

  function retake() {
    setImage("");
  }

  function handleImageUpload(e) {
    setImage(e.target.files[0]);
    console.log(e.target.files[0]);
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setImageURL(objectUrl);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        on
        value={photoUpload}
      />
      {image ? (
        <div>
          {imageURL ? <img src={imageURL}></img> : <img src={image}></img>}
          <button onClick={retake}>retake</button>
          <ImagetoText image={image} imageURL={imageURL} />
        </div>
      ) : (
        <Camera onTakePhotoAnimationDone={handleTakePhotoAnimationDone} />
      )}
    </div>
  );
};

export default TakePhoto;
