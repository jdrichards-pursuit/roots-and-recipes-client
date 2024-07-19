import { Camera } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useState } from 'react';
import ImagetoText from './ImagetoText';
import { Camera as CameraIcon } from "lucide-react";


const TakePhoto = () => {
    const [image, setImage] = useState('');
    const [imageURL, setImageURL] = useState('')
    const [showCamera, setShowCamera] = useState(false);

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
                    <ImagetoText image={image} />
                </div>}
        </div>
    )
}

export default TakePhoto