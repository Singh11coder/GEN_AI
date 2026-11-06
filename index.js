import {ChatGroq} from "@langchain/groq";
import rl from "readline/promises";
import {createAgent, tool} from 'langchain';
import dotenv from 'dotenv';
import * as z from "zod";
dotenv.config();

const events = [];

const createEventTool = tool(
    async function ({date, title, description}){
      console.log("Creating Events",{date,title,description})
       events.push({
          date,
          title,
          description
       })

       return "Event Created";
    },
    {
      name:"createEvent",
      description:"Create a new Event with a date, title and description",
      schema:z.object({
         date:z.string(),
         title:z.string(),
         description:z.string()
      })
    }
    
)

const getEventTool = tool(
   async function (){

      console.log("Getting Events",events)
      return events;
   },
   {
      name:"getEvents",
      description:"Retrieves all events",
      schema:z.object()
   }
)

const readline = rl.createInterface({
    input:process.stdin,
    output:process.stdout
})

const model = new ChatGroq({
   model:"openai/gpt-oss-120b",
   apiKey:process.env.GROQ_API_KEY
})

const agent = createAgent({
    model,
    tools:[createEventTool, getEventTool]
})

const messages=[];

while(true){
   const userInput = await readline.question("Enter Text :->");

   const stream = await agent.stream({
        messages:[
          {
            role:"user",
            content:userInput
          }
       ]
   },{streamMode: "messages"});

   for await (const [chunk] of stream){ 
      process.stdout.write(chunk.content);
   }
 process.stdout.write("\n")
}