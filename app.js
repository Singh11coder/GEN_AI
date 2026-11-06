import { ChatGroq } from "@langchain/groq";
import rl from "readline/promises";
import dotenv from "dotenv";


dotenv.config();

const model = new ChatGroq({
    model:"openai/gpt-oss-120b",
    apiKey:process.env.GROQ_API_KEY
});

const readline = rl.createInterface({
    input:process.stdin,
    output:process.stdout
})

let messages = [];

while(true){
    const userInput = await readline.question("Enter Your Text -> ");
    messages.push(userInput);

    const stream = await model.stream(messages);

    let aiMessage =~ "";
    for await (const chunk of stream){
        aiMessage += chunk;
        process.stdout.write(chunk.content);
    }
    messages.push(aiMessage);
    process.stdout.write("\n");
}