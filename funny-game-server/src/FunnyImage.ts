import Player from "./Player";

export default class FunnyImage {

    owner: Player;
    urls: string[];
    prompts: string[];

    constructor(owner: Player) {
        this.owner = owner
        this.urls = [];
        this.prompts = [];
    }

    generateNextImage(prompt: string) {
        this.prompts.push(prompt)

        // TODO: generate image and add to urls
    }
}