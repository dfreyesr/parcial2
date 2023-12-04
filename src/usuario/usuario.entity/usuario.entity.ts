import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RedSocialEntity } from '../../red-social/red-social.entity/red-social.entity';
import { FotoEntity } from '../../foto/foto.entity/foto.entity';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nombre: string;

  @Column()
  telefono: string;

  @ManyToOne(() => RedSocialEntity, (redSocial) => redSocial.usuarios)
  redSocial: RedSocialEntity;

  @OneToMany(() => FotoEntity, (foto) => foto.usuario)
  fotos: FotoEntity[];
}
