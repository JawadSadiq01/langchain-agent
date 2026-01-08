import { createMiddleware } from "langchain";
import { z } from "zod";

const simpleResponse = z.object({
  answer: z.string().describe("A brief answer"),
});

const detailedResponse = z.object({
  answer: z.string().describe("A detailed answer"),
  reasoning: z.string().describe("Explanation of reasoning"),
  confidence: z.number().describe("Confidence score 0-1"),
});

export const formatResponseMiddleware = createMiddleware({
  name: "StateBasedOutput",
  wrapModelCall: (request, handler) => {
    const messageCount = request.messages.length;  
    const responseFormat = messageCount < 3 ? simpleResponse : detailedResponse;

    // Create a new request with responseFormat
    const modifiedRequest = {
      ...request,
      responseFormat,
    } as typeof request & { responseFormat: typeof simpleResponse };

    return handler(modifiedRequest);
  },
});