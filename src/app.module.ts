import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailAgentModule } from './email-agent/email-agent.module';

@Module({
  imports: [EmailAgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
