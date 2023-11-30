import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FotoModule } from './foto/foto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AlbumModule } from './album/album.module';
import { RedSocialModule } from './red-social/red-social.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotoEntity } from './foto/foto.entity/foto.entity';
import { AlbumEntity } from './album/album.entity/album.entity';
import { RedSocialEntity } from './red-social/red-social.entity/red-social.entity';
import { UsuarioEntity } from './usuario/usuario.entity/usuario.entity';

@Module({
  imports: [
    FotoModule,
    UsuarioModule,
    AlbumModule,
    RedSocialModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'museum',
      entities: [FotoEntity, AlbumEntity, RedSocialEntity, UsuarioEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
