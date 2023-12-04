import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/business-errors';
import { AlbumService } from '../album/album.service';
import { FotoEntity } from './foto.entity/foto.entity';

@Injectable()
export class FotoService {
  constructor(
    @InjectRepository(FotoEntity)
    private fotoRepository: Repository<FotoEntity>,
    private albumService: AlbumService,
  ) {}

  async createFoto(fotoData: {
    ISO: number;
    velObturacion: number;
    apertura: number;
    albumId: string;
  }): Promise<FotoEntity> {
    const { ISO, velObturacion, apertura } = fotoData;

    const parameters = [ISO, velObturacion, apertura];
    const limits = [100, 6400, 2, 250, 1, 32];
    let aboveMid = 0;

    parameters.forEach((param, index) => {
      const midValue = (limits[index * 2] + limits[index * 2 + 1]) / 2;
      if (param < limits[index * 2] || param > limits[index * 2 + 1]) {
        throw new BusinessLogicException(
          `El valor ${param} está fuera de los límites permitidos`,
          BusinessError.PRECONDITION_FAILED,
        );
      }
      if (param > midValue) {
        aboveMid++;
      }
    });

    if (aboveMid > 2) {
      throw new BusinessLogicException(
        'Máximo 2 parámetros pueden estar por encima de su valor medio',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const newFoto = this.fotoRepository.create(fotoData);
    return await this.fotoRepository.save(newFoto);
  }

  async findFotoById(id: number): Promise<FotoEntity> {
    const foto = await this.fotoRepository.findOne({ where: { id } });
    if (!foto) {
      throw new BusinessLogicException(
        `Foto con ID ${id} no encontrada`,
        BusinessError.NOT_FOUND,
      );
    }
    return foto;
  }

  async findAllFotos(): Promise<FotoEntity[]> {
    return await this.fotoRepository.find();
  }

  async deleteFoto(id: number): Promise<void> {
    const foto = await this.findFotoById(id);

    if (foto.album && foto.album.fotos.length === 1) {
      await this.albumService.deleteAlbum(foto.album.id);
    }

    await this.fotoRepository.remove(foto);
  }
}
