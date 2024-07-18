const Anthropic = require("@anthropic-ai/sdk");
// const URL = import.meta.env.VITE_CLAUDEAI_API_KEY;

async function claudeAPICall(input) {
    console.log("URL:", URL)
    const anthropic = new Anthropic({
        apiKey: process.env.VITE_CLAUDEAI_API_KEY,
    });

    const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229", // Worth checking to see if there is a more uptodate model version
        max_tokens: 4096, // Max as of writting this gist
        temperature: 0, // 0.0-1.0, higher is more random (ie. 0.5)
        system: `Extract all the ingredients from this text and format the output in JSON with the name as a string and quantity as an integer`,
        messages: [{ role: "user", content: input }],
    });

    const response = msg.content[0].text;
    console.log(response); // For debugging
    return response;
}

export default claudeAPICall




// async function getIngredients(ocr) {
//     const claude = new Claude({
//         sessionKey: URL
//     });

//     await claude.init();
//     const conversation = await claude.startConversation(`Extract all the ingredients from this text and format the output in JSON with the name as a string and quantity as an integer: ${ocr}`);
// }

// export default getIngredients