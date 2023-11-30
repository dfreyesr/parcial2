import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FotoEntity } from '../../foto/foto.entity/foto.entity';

@Entity()
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('date')
  fechaInicio: string;

  @Column('date')
  fechaFin: string;

  @Column()
  titulo: string;

  @OneToMany(() => FotoEntity, (foto) => foto.album)
  fotos: FotoEntity[];
}
