import Player from "./Player";
import ImageGenerator from "./ImageGenerator";

export default class FunnyImage {

    owner: Player;
    urls: string[];
    prompts: string[];

    constructor(owner: Player) {
        this.owner = owner
        this.urls = [];
        this.prompts = [];
    }

    async generateNextImage(prompt: string) {
        let url = await ImageGenerator.generate(this.prompts, prompt)
        this.urls.push(url)
        this.prompts.push(prompt)
    }
}