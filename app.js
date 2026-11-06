import { ChatGroq } from "@langchain/groq";
import rl from "readline/promises";
import dotenv from "dotenv";


dotenv.config();

const model = new ChatGroq({
   model:"openai/gpt-oss-120b",
   apiKey:process.env.GROQ_API_KEY
})

const readline = rl.createInterface({
    input:process.stdin,
    output:process.stdout
});

while(tue){
    const userInput = await readline.question("Enter you Text: ");

    const stream = await model.stream(userInput);

    for await (const chunk of stream){
       process.stdout.write(chunk.content);
    }
    process.stdout.write("\n");
}