import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

//lines 12-28: https://github.com/RamanSharma100/react-image-to-text/blob/main/src/App.js

const ImagetoText = ({ image }) => {
    const [ocr, setOcr] = useState('');
    const [progress, setProgress] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);

    const extractText = () => {
        setIsLoading(true);
        Tesseract.recognize(image, 'eng', {
            logger: (m) => {
                console.log(m);
                if (m.status === 'recognizing text') {
                    setProgress(parseInt(m.progress * 100));
                }
            },
        })
            .catch((err) => {
                console.error(err);
            })
            .then((result) => {
                // console.log(result.data);
                setOcr(result.data.text);
                setIsLoading(false);
            });
    }

    return (
        <div>
            <button onClick={extractText}>convert </button>
            {isLoading && (
                <>
                    <progress className="form-control" value={progress} max="100">
                        {progress}%{' '}
                    </progress>{' '}
                    <p className="text-center py-0 my-0">Converting:- {progress} %</p>
                </>
            )}
            {!isLoading && ocr && (
                <>
                    <textarea
                        rows="15"
                        value={ocr}
                        onChange={(e) => setOcr(e.target.value)}
                    ></textarea>
                </>
            )}
        </div>
    )
}

export default ImagetoText