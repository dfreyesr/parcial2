import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { FotoService } from './foto.service';
import { FotoDto } from './foto.dto/foto.dto';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('foto')
export class FotoController {
  constructor(private readonly fotoService: FotoService) {}

  @Post()
  async create(@Body() fotoDto: FotoDto) {
    return await this.fotoService.createFoto(fotoDto);
  }

  @Get(':fotoId')
  async findOne(@Param('fotoId') fotoId: number) {
    return await this.fotoService.findFotoById(fotoId);
  }

  @Get()
  async findAll() {
    return await this.fotoService.findAllFotos();
  }

  @Delete(':fotoId')
  @HttpCode(204)
  async delete(@Param('fotoId') fotoId: number) {
    return await this.fotoService.deleteFoto(fotoId);
  }
}
