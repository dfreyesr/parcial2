import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';

@Entity()
export class RedSocialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  nombre: string;

  @Column()
  slogan: string;

  @OneToMany(() => UsuarioEntity, (usuario) => usuario.redSocial)
  usuarios: UsuarioEntity[];
}
