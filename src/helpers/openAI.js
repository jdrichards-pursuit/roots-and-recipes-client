import OpenAI from "openai";
const URL = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: URL, dangerouslyAllowBrowser: true });

async function getIngredients() {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: `Extract all the ingredients from this text and format the output in JSON with the name as a string and quantity as an integer: ${ocr}`, "type": "json_object" }],
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
}

export default getIngredients