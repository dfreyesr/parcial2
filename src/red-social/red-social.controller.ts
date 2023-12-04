import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { RedSocialService } from './red-social.service';
import { RedSocialDto } from './red-social.dto/red-social.dto';

@Controller('red-social')
@UseInterceptors(BusinessErrorsInterceptor)
export class RedSocialController {
  constructor(private readonly redSocialService: RedSocialService) {}

  @Post()
  async create(@Body() redSocialDto: RedSocialDto) {
    return await this.redSocialService.createRedSocial(redSocialDto);
  }
}
