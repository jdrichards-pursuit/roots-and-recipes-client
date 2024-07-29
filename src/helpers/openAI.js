import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPEN_AI_PROJECT_KEY
const organization = import.meta.env.VITE_OPEN_AI_ORGANIZATION
const project = import.meta.env.VITE_OPEN_AI_PROJECT
const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    organization: organization,
    project: project,
});


export async function callOpenAI(image) {
    if (image) {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: [{
                        type: "text",
                        text: `You are an AI that extracts the ingredients and steps from an image with text. The image has been uploaded to Cloudinary and can be accessed at the given url. Only use the instructions provided and return a JSON object. Remove any markers that signify that the steps are in an ordered list. 
                        Fill the JSON template below:
                        {"ingredients": ["2 eggs", "3 3/4 cups milk", "1/2 tablespoons honey"],
                        "steps": ["Put in the flour.", "Mix the dry ingredients", "Crack the eggs in the bowl"],
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
        return JSON.parse(response.choices[0].message.content);
    }
}