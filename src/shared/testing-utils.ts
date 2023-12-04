import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { FotoEntity } from '../foto/foto.entity/foto.entity';
import { RedSocialEntity } from '../red-social/red-social.entity/red-social.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [AlbumEntity, RedSocialEntity, FotoEntity, UsuarioEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    AlbumEntity,
    RedSocialEntity,
    FotoEntity,
    UsuarioEntity,
  ]),
];
