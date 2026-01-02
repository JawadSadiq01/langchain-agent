import { Module } from '@nestjs/common';
import { WebService } from './web.service';
import { WebController } from './web.controller';
import { SearchAgent } from './agents/search.agent';

@Module({
  controllers: [WebController],
  providers: [WebService, SearchAgent],
})
export class WebModule {}
