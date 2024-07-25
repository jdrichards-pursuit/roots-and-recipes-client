import { useEffect, useState } from 'react';
import OpenAI from "openai";
const URL = import.meta.env.VITE_OPEN_AI_PROJECT_KEY;


const ImagetoText = ({ image }) => {
    const [ocr, setOcr] = useState('');
    // console.log(image)
    // const [progress, setProgress] = React.useState(0);
    // const [isLoading, setIsLoading] = React.useState(false);

    const OPENAI_API_KEY = URL
    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
        organization: "org-HZjWJq5DnKpLvGplfuiHwe4p",
        project: "proj_akgh7dreuPlPZMsawynmbwEU",
    });

    useEffect(() => {
        async function callOpenAI() {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: [{
                            type: "text",
                            text: `You are an AI that extracts the ingredients and steps from an image with text. The image has been uploaded to Cloudinary and can be accessed at the given url. Only use the instructions provided and return a JSON object. 
                                Fill the JSON template below:
                                {"ingredients": ["2 eggs", "3 3/4 cups milk", "1/2 tablespoons honey"],
                                "steps": ["1. Put in the flour.", "2. Mix the dry ingredients", "3. Crack the eggs in the bowl"],
                                "prompt": "Whatever."}`}]
                    },
                    {
                        role: "user",
                        content: [{
                            type: "image_url",
                            image_url: {
                                "url": image,
                                "detail": "auto"
                            }
                        }],
                    },
                ],
                response_format: { type: "json_object" },
            });
            console.log(response.choices[0]);
            console.log(JSON.parse(response.choices[0].message.content))
        }
        if (image) {
            callOpenAI();
        }
    }, [])

    const extractText = () => {

    }

    return (
        <div>
            <button onClick={extractText}>Convert to Text</button>
            {/* {isLoading && (
                <>
                    <progress className="form-control" value={progress} max="100">
                        {progress}%{' '}
                    </progress>{' '}
                    <p className="text-center py-0 my-0">Converting:- {progress} %</p>
                </>
            )} */}
        </div>
    )
}

export default ImagetoText