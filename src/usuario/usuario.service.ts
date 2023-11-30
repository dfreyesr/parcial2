import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/business-errors';
import { UsuarioEntity } from './usuario.entity/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async createUsuario(usuarioData: {
    nombre: string;
    telefono: string;
  }): Promise<UsuarioEntity> {
    if (usuarioData.telefono.length !== 10) {
      throw new BusinessLogicException(
        'El teléfono debe tener 10 caracteres',
        BusinessError.BAD_REQUEST,
      );
    }

    const newUsuario = this.usuarioRepository.create(usuarioData);
    return await this.usuarioRepository.save(newUsuario);
  }

  async findUsuarioById(id: number): Promise<UsuarioEntity> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new BusinessLogicException(
        `Usuario con ID ${id} no encontrado`,
        BusinessError.NOT_FOUND,
      );
    }
    return usuario;
  }

  async findAllUsuarios(): Promise<UsuarioEntity[]> {
    return await this.usuarioRepository.find();
  }
}
