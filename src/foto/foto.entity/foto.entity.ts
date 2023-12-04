import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AlbumEntity } from '../../album/album.entity/album.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';

@Entity()
export class FotoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ISO: number;

  @Column()
  velObturacion: number;

  @Column()
  apertura: number;

  @Column()
  fecha: string;

  @ManyToOne(() => AlbumEntity, (album) => album.fotos)
  album: AlbumEntity;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.fotos)
  usuario: UsuarioEntity;
}
