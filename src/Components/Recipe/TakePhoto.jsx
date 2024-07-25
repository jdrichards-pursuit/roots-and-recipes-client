import { Camera } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useState } from 'react';
import RecipeForm from './RecipeForm';
import { Camera as CameraIcon } from "lucide-react";


const TakePhoto = () => {
    const [image, setImage] = useState('');
    const [imageURL, setImageURL] = useState('')
    const [showCamera, setShowCamera] = useState(false);
    const [toggleForm, setToggleForm] = useState(false);

    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET_KEY;
    const cloudName = import.meta.env.VITE_CLOUD_NAME;

    async function uploadImagetoCloudinary() {
        const recipeImage = new FormData();
        recipeImage.append("file", image);
        recipeImage.append("cloud_name", cloudName);
        recipeImage.append("upload_preset", uploadPreset);
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: recipeImage }
        );

        const data = await response.json();
        setImage(data.url.toString())
        setToggleForm(true);
    }

    function handleTakePhotoAnimationDone(dataUri) {
        setImageURL('')
        setImage(dataUri)
        setShowCamera(false);
    }

    function retake() {
        setImage("");
    }

    function handleImageUpload(e) {
        setImage(e.target.files[0])
        const objectUrl = URL.createObjectURL(e.target.files[0])
        setImageURL(objectUrl)
    }

    function handleCameraChange() {
        setShowCamera(!showCamera);
    }

    return (
        <>
            {(!toggleForm) &&
                <div className='grid-cols-1 place-content-around'>
                    <h3>Image Upload</h3>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    <h3>Take a Picture</h3>
                    <div className="flex justify-center">
                        <CameraIcon onClick={handleCameraChange} />
                    </div>
                    {(showCamera) &&
                        <div className="flex justify-center">
                            <div className='w-1/2'>
                                <Camera onTakePhotoAnimationDone={handleTakePhotoAnimationDone} />
                            </div>
                        </div>}
                    {(image) &&
                        <div>
                            {(imageURL)
                                ?
                                <img src={imageURL}></img>
                                : <img src={image}></img>}
                            <button onClick={retake}>retake</button>
                            <button onClick={uploadImagetoCloudinary}>Use this Image</button>
                        </div>}
                </div>
            }
            {toggleForm && < RecipeForm image={image} />
            }
        </>
    )
}

export default TakePhoto