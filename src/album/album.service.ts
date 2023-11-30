import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/business-errors';
import { AlbumEntity } from './album.entity/album.entity';
import { FotoEntity } from '../foto/foto.entity/foto.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
    @InjectRepository(FotoEntity)
    private fotoRepository: Repository<FotoEntity>,
  ) {}

  async createAlbum(albumData: {
    titulo: string;
    fechaInicio: string;
    fechaFin: string;
  }): Promise<AlbumEntity> {
    if (!albumData.titulo) {
      throw new BusinessLogicException(
        'El título no puede estar vacío',
        BusinessError.BAD_REQUEST,
      );
    }

    const newAlbum = this.albumRepository.create(albumData);
    return await this.albumRepository.save(newAlbum);
  }

  async findAlbumById(id: number): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['fotos'],
    });
    if (!album) {
      throw new BusinessLogicException(
        `Álbum con ID ${id} no encontrado`,
        BusinessError.NOT_FOUND,
      );
    }
    return album;
  }

  async addPhotoToAlbum(
    albumId: number,
    photoId: number,
  ): Promise<AlbumEntity> {
    const id = photoId;
    const album = await this.findAlbumById(albumId);
    const photo = await this.fotoRepository.findOne({
      where: { id },
    });

    if (!photo) {
      throw new BusinessLogicException(
        `Foto con ID ${photoId} no encontrada`,
        BusinessError.NOT_FOUND,
      );
    }

    const photoDate = new Date(photo.fecha);
    if (
      photoDate < new Date(album.fechaInicio) ||
      photoDate > new Date(album.fechaFin)
    ) {
      throw new BusinessLogicException(
        'La fecha de la foto no está dentro del rango del álbum',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    album.fotos = [...album.fotos, photo];
    return await this.albumRepository.save(album);
  }

  async deleteAlbum(id: number): Promise<void> {
    const album = await this.findAlbumById(id);

    if (album.fotos.length > 0) {
      throw new BusinessLogicException(
        'No se puede eliminar un álbum con fotos asignadas',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    await this.albumRepository.remove(album);
  }
}
