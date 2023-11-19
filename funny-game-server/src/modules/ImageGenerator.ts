import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export default class ImageGenerator {
    // @ts-ignore
    private static openai = new OpenAI(process.env.OPENAI_API_KEY);

    public static async refinePrompt(prompts: string[], next: string): Promise<string> {
        const system = "Your role is an Image Prompt Refiner. You receive a sequence of story frames as textual descriptions. Your task is to enhance the provided text for the upcoming frame, ensuring that when used as a prompt for DALL-E, it will yield a high-quality image that is consistent with the narrative. Make sure to refine the prompt to produce a dreamy and cartoonish art style. \n" +
            "\n" +
            "You must output ONLY the prompt for the next frame, no other text or metadata. ";

        const chatCompletion = await ImageGenerator.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    content: system,
                    role: "system"
                },
                {
                    content: "Previous story frames: \n" + prompts.join("\n") + "\nNext frame: \n" + next,
                    role: "user"
                }
            ],
        })

        // @ts-ignore
        return chatCompletion.choices[0].message.content;
    }

    public static async generate(prompts: string[], next: string): Promise<string> {
        let refinedPrompt = await this.refinePrompt(prompts, next);
        try {
            const imageCompletion = await ImageGenerator.openai.images.generate({
                prompt: refinedPrompt,
                model: "dall-e-2",
                size: "256x256" //1024x1024
            });
            // @ts-ignore
            return imageCompletion.data[0]["url"];
        } catch (error) {
            console.error('Error generating image:', error);
            throw error; // or return a default value
        }
    }
}
