import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { faker } from '@faker-js/faker';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsuarioService', () => {
  let repository: Repository<UsuarioEntity>;
  let service: UsuarioService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
  });

  it('createUsuario should return a new usuario entity', async () => {
    const usuarioData = {
      nombre: faker.lorem.word(),
      telefono: faker.string.numeric(10),
    };

    const newUsuario: UsuarioEntity = await service.createUsuario(usuarioData);
    expect(newUsuario).not.toBeNull();
    expect(newUsuario.nombre).toEqual(usuarioData.nombre);
    expect(newUsuario.telefono).toEqual(usuarioData.telefono);

    const storedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: newUsuario.id },
    });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.nombre).toEqual(newUsuario.nombre);
    expect(storedUsuario.telefono).toEqual(newUsuario.telefono);
  });

  it('createUsuario should fail if the telefono is not 10 characters long', async () => {
    const invalidUsuarioData = {
      nombre: faker.lorem.word(),
      telefono: faker.string.numeric(5),
    };

    await expect(
      service.createUsuario(invalidUsuarioData),
    ).rejects.toHaveProperty('message', 'El teléfono debe tener 10 caracteres');
  });

  it('findUsuarioById should return a usuario', async () => {
    const usuarioData = {
      nombre: faker.lorem.word(),
      telefono: faker.string.numeric(10),
    };
    const usuario = repository.create(usuarioData);
    await repository.save(usuario);

    const foundUsuario = await service.findUsuarioById(usuario.id);
    expect(foundUsuario).not.toBeNull();
    expect(foundUsuario.id).toEqual(usuario.id);
  });

  it('findUsuarioById should fail for non-existent usuario', async () => {
    const nonExistentId = -1;

    await expect(service.findUsuarioById(nonExistentId)).rejects.toHaveProperty(
      'message',
      'Usuario con ID -1 no encontrado',
    );
  });

  it('findAllUsuarios should return all usuarios', async () => {
    const usuario1Data = {
      nombre: faker.lorem.word(),
      telefono: faker.string.numeric(10),
    };

    const usuario2Data = {
      nombre: faker.lorem.word(),
      telefono: faker.string.numeric(10),
    };
    const usuario1 = repository.create(usuario1Data);
    await repository.save(usuario1);
    const usuario2 = repository.create(usuario2Data);
    await repository.save(usuario2);

    const usuarios = await service.findAllUsuarios();
    expect(usuarios).toHaveLength(2);
    expect(usuarios).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: usuario1.id }),
        expect.objectContaining({ id: usuario2.id }),
      ]),
    );
  });

  it('findAllUsuarios should handle errors', async () => {
    jest
      .spyOn(repository, 'find')
      .mockRejectedValueOnce(new Error('Database connection error'));

    await expect(service.findAllUsuarios()).rejects.toThrow(
      'Database connection error',
    );
  });
});
