require('dotenv').config({ path: '.env.local' });
const { generateText } = require('./src/lib/gemini.js');

async function test() {
  try {
    console.log("Testing generateText...");
    const res = await generateText("Hello, what is your name?");
    console.log("Success:", res);
  } catch (err) {
    console.error("Failed:", err);
  }
}

test();
