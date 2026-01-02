import { Injectable } from '@nestjs/common';
import { SearchAgent } from './agents/search.agent';

@Injectable()
export class WebService {
  constructor(private readonly searchAgent: SearchAgent) {}

  async search(query: string) {
    return await this.searchAgent.search(query);
  }
}
