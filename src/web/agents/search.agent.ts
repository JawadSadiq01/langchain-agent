import { initChatModel } from 'langchain';

export class SearchAgent {
  constructor() {}

  async search(query: string) {
    const model = await initChatModel(process.env.OPENAI_MODEL);
    const modelWithTools = model.bindTools([{ type: 'web_search' }]);

    const message = await modelWithTools.invoke(
      `Search the web for ${query}`,
    );

    return message.text;
  }
}
