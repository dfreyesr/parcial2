// red-social.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedSocialService } from './red-social.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { RedSocialEntity } from './red-social.entity/red-social.entity';
import { faker } from '@faker-js/faker';

describe('RedSocialService', () => {
  let service: RedSocialService;
  let repository: Repository<RedSocialEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RedSocialService],
    }).compile();

    service = module.get<RedSocialService>(RedSocialService);
    repository = module.get<Repository<RedSocialEntity>>(
      getRepositoryToken(RedSocialEntity),
    );
  });

  it('createRedSocial should return a new red social entity', async () => {
    const redSocialData = {
      nombre: faker.company.name(),
      slogan: faker.lorem.paragraph(),
    };

    const newRedSocial: RedSocialEntity =
      await service.createRedSocial(redSocialData);
    expect(newRedSocial).not.toBeNull();
    expect(newRedSocial.nombre).toEqual(redSocialData.nombre);
    expect(newRedSocial.slogan).toEqual(redSocialData.slogan);
  });

  it('createRedSocial should fail if the slogan is too short or empty', async () => {
    const invalidRedSocialData = {
      nombre: faker.company.name(),
      slogan: 'Short',
    };

    await expect(
      service.createRedSocial(invalidRedSocialData),
    ).rejects.toHaveProperty(
      'message',
      'El slogan no puede estar vacío y debe tener al menos 20 caracteres',
    );
  });
});
