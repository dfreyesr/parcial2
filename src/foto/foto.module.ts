import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotoService } from './foto.service';
import { AlbumModule } from '../album/album.module';
import { FotoEntity } from './foto.entity/foto.entity';
import { FotoController } from './foto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FotoEntity]), AlbumModule],
  providers: [FotoService],
  exports: [FotoService],
  controllers: [FotoController],
})
export class FotoModule {}
