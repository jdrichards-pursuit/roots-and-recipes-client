import { Camera, FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useState } from 'react';
import EditRecipePhotoForm from './EditRecipePhotoForm';
import { Camera as CameraIcon } from "lucide-react";


const TakePhoto = () => {
    const [image, setImage] = useState('');
    const [file, setFile] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [toggleForm, setToggleForm] = useState(false);
    const [cameraError, setCameraError] = useState(false);
    const [toggleRetake, setToggleRetake] = useState(false);

    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET_KEY;
    const cloudName = import.meta.env.VITE_CLOUD_NAME;

    async function uploadImagetoCloudinary() {
        const recipeImage = new FormData();
        recipeImage.append("file", file);
        recipeImage.append("cloud_name", cloudName);
        recipeImage.append("upload_preset", uploadPreset);
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: recipeImage }
        );

        const data = await response.json();
        setImage(data.secure_url);
        setToggleForm(true);
    }

    function handleTakePhotoAnimationDone(dataUri) {
        setImage(dataUri)
        setShowCamera(false);
        setToggleRetake(true)
    }

    function retake() {
        setImage("");
        setFile(null);
        setShowCamera(true)
    }

    function handleImageUpload(e) {
        if (e.target.files[0].size > 10485760) {
            alert("This image is to large.")
        } else {
            const objectUrl = URL.createObjectURL(e.target.files[0])
            setImage(objectUrl)
            setFile(e.target.files[0])
            setToggleRetake(false);
        }
    }

    function handleCameraToggle() {
        setShowCamera(!showCamera);
    }

    function handleCameraError(e) {
        console.log('handleCameraError', e);
        setCameraError(true)
        setShowCamera(false)
        setImage("")
        setFile(null)
    }

    return (
        <>
            {(!toggleForm) &&
                <div className='grid-cols-1 place-content-around'>
                    <h3>Image Upload</h3>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    <h3>Take a Picture</h3>
                    <div className="flex justify-center">
                        <CameraIcon onClick={handleCameraToggle} />
                    </div>
                    {(showCamera) &&
                        <div className="flex justify-center">
                            <div className='w-1/2'>
                                <Camera
                                    idealFacingMode={FACING_MODES.ENVIRONMENT}
                                    onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
                                    onCameraError={(error) => { handleCameraError(error); }} />
                            </div>
                        </div>}
                    {(cameraError) &&
                        <div>Camera Access is Off</div>}
                    {(image) &&
                        <div>
                            <img src={image}></img>
                            <div className='flex flex-row justify-center'>
                                {toggleRetake &&
                                    <button onClick={retake}
                                        className='bg-[#C7DEF1] m-5 border-solid border-2 border-[#713A3A] rounded-xl text-[#713A3A]'
                                    >retake</button>}
                                <button onClick={uploadImagetoCloudinary}
                                    className='bg-[#C7DEF1] w-40 m-5 border-solid border-2 border-[#713A3A] rounded-xl text-[#713A3A]'
                                >Use this Image</button>
                            </div>

                        </div>}
                </div>
            }
            {toggleForm && < EditRecipePhotoForm image={image} />}
        </>
    )
}
export default TakePhoto;
