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
        setImage(dataUri);
        setShowCamera(false);
        setToggleRetake(true);
    }

    function retake() {
        setImage("");
        setFile(null);
        setShowCamera(true);
    }

    function handleImageUpload(e) {
        if (e.target.files[0].size > 10485760) {
            alert("This image is too large.");
        } else {
            const objectUrl = URL.createObjectURL(e.target.files[0]);
            setImage(objectUrl);
            setFile(e.target.files[0]);
            setToggleRetake(false);
        }
    }

    function handleCameraToggle() {
        setShowCamera(!showCamera);
    }

    function handleCameraError(e) {
        console.log('handleCameraError', e);
        setCameraError(true);
        setShowCamera(false);
        setImage("");
        setFile(null);
    }

    return (
        <>
            {(!toggleForm) &&
                <div className="flex flex-col items-center gap-6">
                    <h3 className="text-lg font-semibold text-[#713A3A]">Image Upload</h3>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="cursor-pointer bg-white border border-gray-300 rounded-lg p-2 text-gray-700 shadow-sm"
                    />
                    <h3 className="text-lg font-semibold text-[#713A3A]">Take a Picture</h3>
                    <div className="flex justify-center mb-4">
                        <CameraIcon 
                            onClick={handleCameraToggle} 
                            className="cursor-pointer text-[#713A3A] hover:text-gray-500 transition-colors duration-300" 
                            size={32}
                        />
                    </div>
                    {(showCamera) &&
                        <div className="flex justify-center">
                            <div className="w-72">
                                <Camera
                                    idealFacingMode={FACING_MODES.ENVIRONMENT}
                                    onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
                                    onCameraError={handleCameraError}
                                    isImageMirror={false}
                                />
                            </div>
                        </div>
                    }
                    {(cameraError) &&
                        <div className="text-red-600">Camera Access is Off</div>}
                    {(image) &&
                        <div className="flex flex-col items-center gap-4">
                            <img src={image} alt="Captured" className="max-w-full rounded-lg shadow-md" />
                            <div className="flex flex-row justify-center gap-4">
                                {toggleRetake &&
                                    <button 
                                        onClick={retake}
                                        className="bg-gray-200 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-transform transform hover:bg-gray-300 hover:text-gray-800"
                                    >
                                        Retake
                                    </button>}
                                <button 
                                    onClick={uploadImagetoCloudinary}
                                    className="bg-gray-200 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 transition-transform transform hover:bg-gray-300 hover:text-gray-800"
                                >
                                    Use this Image
                                </button>
                            </div>
                        </div>
                    }
                </div>
            }
            {toggleForm && <EditRecipePhotoForm image={image} />}
        </>
    );
};

export default TakePhoto;
