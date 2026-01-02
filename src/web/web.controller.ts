import { Controller, Post, Body } from '@nestjs/common';
import { WebService } from './web.service';
import { SearchDto } from './dto/search.dto';

@Controller('web')
export class WebController {
  constructor(private readonly webService: WebService) {}

  @Post('search')
  search(@Body() dto: SearchDto) {
    return this.webService.search(dto.query);
  }
}
