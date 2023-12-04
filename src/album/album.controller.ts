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
import { AlbumService } from './album.service';
import { AlbumDto } from './album.dto/album.dto';

@Controller('album')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  async create(@Body() albumDto: AlbumDto) {
    return await this.albumService.createAlbum(albumDto);
  }

  @Get(':albumId')
  async findOne(@Param('albumId') albumId: number) {
    return await this.albumService.findAlbumById(albumId);
  }

  @Post(':albumId/photos/:photoId')
  async addPhoto(
    @Param('albumId') albumId: number,
    @Param('photoId') photoId: number,
  ) {
    return await this.albumService.addPhotoToAlbum(albumId, photoId);
  }

  @Delete(':albumId')
  @HttpCode(204)
  async delete(@Param('albumId') albumId: number) {
    return await this.albumService.deleteAlbum(albumId);
  }
}
