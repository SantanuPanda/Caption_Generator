require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function GenerateCaption(base64ImageFile) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },

    { text: "Caption this image." },
  ];
   const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `You are an expert in generating captions for images. You will be shown an image and asked to provide a caption for it. Your caption should be short and concise. You should not generate any other text. You use hashtags and emojis for visual enhancement.generate caption in tapori language. at list of 5 hashtags.`
  });
  const result = await model.generateContent(contents);

  return result.response.text();
}

module.exports = GenerateCaption;
