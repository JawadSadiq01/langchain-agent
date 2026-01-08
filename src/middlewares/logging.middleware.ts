import * as z from "zod";
import { createMiddleware } from "langchain";

const contextSchema = z.object({
  senderName: z.string(),
});

export const loggingMiddleware = createMiddleware({
  name: "Logging",
  contextSchema,
  beforeModel: (state, runtime) => {  
    console.log(`Processing request for user: ${runtime.context?.senderName}`);  
    return;
  },
  afterModel: (state, runtime) => {  
    console.log(`Completed request for user: ${runtime.context?.senderName}`);  
    return;
  },
});