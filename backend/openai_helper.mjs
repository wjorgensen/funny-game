import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async function generate(prompt) {
    const imageCompletion = await openai.images.generate({ prompt: prompt, model: "dall-e-2", size: "256x256" });
    return imageCompletion.data[0]["url"];
}
