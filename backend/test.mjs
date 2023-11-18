import readline from 'readline';
import openai_helper from './openai_helper.mjs';

// Assuming you have a function to call OpenAI API and return an image URL
async function generateImage(prompt) {
  return openai_helper(prompt);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getUserInput(question) {
  return new Promise(resolve => {
    rl.question(question, (input) => {
      resolve(input);
    });
  });
}

async function continueStory() {
  let story = '';
  for (let i = 0; i < 5; i++) {
    const userInput = await getUserInput(`Continue the story: ${story}\n`);
    story += userInput + " ";

    const imageUrl = await generateImage(story);
    console.log(`Image for this part of the story: ${imageUrl}`);
    // In a console environment, you can't display images. You might want to open the image URL in a browser.
  }

  console.log("Final Story:", story);
  rl.close();
}

continueStory().then(r => console.log("Done"));
