import { initChatModel } from 'langchain';
import { formatResponseMiddleware } from 'src/middlewares';

export class SearchAgent {
  constructor() {}

  async search(query: string) {
    const model = await initChatModel(process.env.OPENAI_MODEL);
    const modelWithTools = model.bindTools(
      [{ type: 'web_search' }],
      {
        callbacks: [formatResponseMiddleware],
      }
    );

    const message = await modelWithTools.invoke(
      [{
        role: "system",
        content: `Search the web for ${query}`,
      }],
    );

    return message.text;
  }
}
