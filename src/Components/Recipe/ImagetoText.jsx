import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { Link } from "react-router-dom";
import OpenAI from "openai";
const URL = import.meta.env.VITE_OPENAI_API_KEY;


const openai = new OpenAI({ apiKey: URL, dangerouslyAllowBrowser: true });

//lines 12-28: https://github.com/RamanSharma100/react-image-to-text/blob/main/src/App.js

const ImagetoText = ({ image }) => {
    const [ocr, setOcr] = useState('');
    const [progress, setProgress] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);

    const extractText = () => {
        setIsLoading(true);
        Tesseract.recognize(image, 'eng', {
            logger: (m) => {
                // console.log(m);
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
                getIngredients(result.data.text)
            });
    }

    async function getIngredients() {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: `Extract all the ingredients from this text and format the output in JSON with the name as a string and quantity as an integer: ${ocr}`, "type": "json_object" }],
            model: "gpt-3.5-turbo",
        });

        console.log(completion.choices[0]);
    }

    return (
        <div>
            <button onClick={extractText}>Convert to Text</button>
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
                    {/* <Link to={`/recipe_form`}> */}
                    <textarea
                        rows="15"
                        value={ocr}
                        onChange={(e) => setOcr(e.target.value)}
                    ></textarea>
                    {/* </Link> */}
                </>
            )}
        </div>
    )
}

export default ImagetoText