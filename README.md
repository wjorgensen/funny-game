# 🎮 Funny Game


## Welcome to Funny Game, a unique browser-based game that blends the excitement of drawing and guessing with the power of AI. Created during BostonHacks 2023.
## 🕹️ Gameplay

In Funny Game, creativity and spontaneity are key. Players join a lobby, input prompts, and AI-generated images based on these prompts are passed around. Each round contributes to an evolving story, often leading to humorous and unexpected results showcased at the game's conclusion.

<img src="https://github.com/wjorgensen/funny-game/blob/main/game-images/Screenshot%202023-11-19%20at%203.34.49%20AM.png?raw=true">

## 🛠️ Technology Stack

- **Frontend**: Developed with Next.js for a responsive and interactive user experience.
- **Real-Time Communication**: Uses socket.io for seamless player interactions.
- **AI Integration**: Leverages OpenAI's API for transforming text prompts into images.
- **Styling**: Enhanced with Sass for a sleek and engaging design.

## Features

- **Lobby System**: Create or join rooms for gameplay with friends.
- **Prompt Input**: Players have a set time to input their prompts.
- **AI-Generated Images**: Visuals created from prompts using OpenAI's API.
- **Sequential Gameplay**: Images and prompts are circulated, crafting a narrative.
- **End-of-Game Display**: The final reveal of the creative journey.

## 🚀 Challenges and Accomplishments

- **Integration**: Combining Next.js, socket.io, and OpenAI presented a rewarding challenge.
- **Team Collaboration**: Overcoming merge conflicts and other hurdles through effective teamwork.
- **Learning Curve**: Enhanced skills in React, Next.js, and GitHub, making this project a great learning experience.

## 🏁 Getting Started

1. **Clone the Repository**: 
```
git clone https://github.com/wjorgensen/funny-game.git
```
2. **Install Dependencies**:
- Navigate to the `funny-game-next` and `funny-game-server` directories.
- Run `npm install` in both to install necessary packages.
3. **Create a .env File**:
- In the `funny-game-server` directory, create a `.env` file.
- Add `OPENAI_API_KEY=Your_API_Key` to the file.
4. **Run the Application**:
- In `funny-game-next`, execute `npm run dev` to start the frontend.
- In `funny-game-server`, use `npm start` to launch the server.

## 🤝 Contributers

Myself, [@s-alad](https://github.com/s-alad), [@CJCrafter](https://github.com/CJCrafter), [@Zhandolia](https://github.com/Zhandolia)

## 📜 License

This project is under the ISC License. See the LICENSE file for more details.
