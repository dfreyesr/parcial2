import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotoService } from './foto.service';
import { AlbumModule } from '../album/album.module';
import { FotoEntity } from './foto.entity/foto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FotoEntity]), AlbumModule],
  providers: [FotoService],
  exports: [FotoService],
})
export class FotoModule {}
