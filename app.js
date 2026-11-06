import { ChatGroq } from "@langchain/groq";
import rl from "readline/promises";
import dotenv from "dotenv";
import {tool, createAgent} from "langchain";
import * as z from "zod";

dotenv.config();

const events = [];

const createEventTool = tool(
     
       async function({date,title,description}){
         console.log("Creating Event",{date,title,description})
           events.push({
               date,
               title,
               description
           })

           return "Event Created"
       
     },
     {
        name:"createEvent",
        description:"create a new Event with Date, Title, Description",
        schema:z.object({
            date:z.string(),
            title:z.string(),
            description:z.string()
        })
     }
)

const getEventTool = tool(
     async function(){
       console.log("Getting Events",events)
       return events;
    },
    {
       name:"getEvents",
       description:"Retrieves all events",
       schema:z.object({})
    }
)


const model = new ChatGroq({
    model:"openai/gpt-oss-120b",
    apiKey:process.env.GROQ_API_KEY
});

const agent = createAgent({
     model,
     tools:[createEventTool, getEventTool]
})

const readline = rl.createInterface({
    input:process.stdin,
    output:process.stdout
})

let messages = [];

while(true){
    const userInput = await readline.question("Enter Your Text -> ");
   
    const stream = await agent.stream({
        messages:[{
            role:"user",
            content:userInput
        }]
    },{streamMode:"messages"})

 
    for await (const [chunk] of stream){
        process.stdout.write(chunk.content);
    }
    process.stdout.write("\n");
}