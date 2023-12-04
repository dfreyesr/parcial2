import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/business-errors';
import { RedSocialEntity } from './red-social.entity/red-social.entity';

@Injectable()
export class RedSocialService {
  constructor(
    @InjectRepository(RedSocialEntity)
    private redSocialRepository: Repository<RedSocialEntity>,
  ) {}

  async createRedSocial(redSocialData: {
    nombre: string;
    slogan: string;
  }): Promise<RedSocialEntity> {
    if (!redSocialData.slogan || redSocialData.slogan.length < 20) {
      throw new BusinessLogicException(
        'El slogan no puede estar vacío y debe tener al menos 20 caracteres',
        BusinessError.BAD_REQUEST,
      );
    }

    const newRedSocial = this.redSocialRepository.create(redSocialData);
    return await this.redSocialRepository.save(newRedSocial);
  }
}
