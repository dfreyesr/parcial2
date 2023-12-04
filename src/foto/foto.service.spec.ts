import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FotoService } from './foto.service';
import { FotoEntity } from './foto.entity/foto.entity';
import { AlbumService } from '../album/album.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { faker } from '@faker-js/faker';

describe('FotoService', () => {
  let service: FotoService;
  let repository: Repository<FotoEntity>;
  let albumService: AlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [FotoService, AlbumService],
    }).compile();

    service = module.get<FotoService>(FotoService);
    repository = module.get<Repository<FotoEntity>>(
      getRepositoryToken(FotoEntity),
    );
    albumService = module.get<AlbumService>(AlbumService);
  });

  it('createFoto should return a new foto', async () => {
    const fotoData = {
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      albumId: faker.string.uuid(),
      fecha: faker.date.recent().toISOString(),
    };

    const newFoto: FotoEntity = await service.createFoto(fotoData);
    expect(newFoto).not.toBeNull();

    const storedFoto: FotoEntity = await service.findFotoById(newFoto.id);
    expect(storedFoto).not.toBeNull();
    expect(storedFoto.ISO).toEqual(newFoto.ISO);
    expect(storedFoto.velObturacion).toEqual(newFoto.velObturacion);
    expect(storedFoto.apertura).toEqual(newFoto.apertura);
    expect(storedFoto.album).toEqual(newFoto.album);
    expect(storedFoto.fecha).toEqual(newFoto.fecha);
  });

  it('deleteFoto should remove a foto', async () => {
    const fotoData = {
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      albumId: faker.string.uuid(),
      fecha: faker.date.recent().toISOString(),
    };
    const foto = repository.create(fotoData);
    await repository.save(foto);

    const storedFoto = await service.findFotoById(foto.id);
    expect(storedFoto).not.toBeNull();

    await service.deleteFoto(foto.id);

    const deletedFoto = await repository.findOne({ where: { id: foto.id } });
    expect(deletedFoto).toBeNull();
  });

  it('createFoto should fail with invalid data', async () => {
    const invalidFotoData = {
      ISO: 50000,
      velObturacion: 300,
      apertura: 50,
      albumId: faker.string.uuid(),
      fecha: faker.date.recent().toISOString(),
    };

    await expect(service.createFoto(invalidFotoData)).rejects.toHaveProperty(
      'message',
      'El valor 50000 está fuera de los límites permitidos',
    );
  });

  it('deleteFoto should fail for non-existent foto', async () => {
    const nonExistentId = -1;

    await expect(service.deleteFoto(nonExistentId)).rejects.toHaveProperty(
      'message',
      'Foto con ID -1 no encontrada',
    );
  });

  it('findFotoById should return a foto', async () => {
    const fotoData = {
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      albumId: faker.string.uuid(),
      fecha: faker.date.recent().toISOString(),
    };
    const foto = repository.create(fotoData);
    await repository.save(foto);

    const foundFoto = await service.findFotoById(foto.id);
    expect(foundFoto).not.toBeNull();
    expect(foundFoto.id).toEqual(foto.id);
  });

  it('findFotoById should fail for non-existent foto', async () => {
    const nonExistentId = -1;

    await expect(service.findFotoById(nonExistentId)).rejects.toHaveProperty(
      'message',
      'Foto con ID -1 no encontrada',
    );
  });

  it('findAllFotos should return all fotos', async () => {
    const foto1Data = {
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      albumId: faker.string.uuid(),
      fecha: faker.date.recent().toISOString(),
    };
    const foto2Data = {
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      albumId: faker.string.uuid(),
      fecha: faker.date.recent().toISOString(),
    };
    const foto1 = repository.create(foto1Data);
    await repository.save(foto1);
    const foto2 = repository.create(foto2Data);
    await repository.save(foto2);

    const fotos = await service.findAllFotos();
    expect(fotos).toHaveLength(2);
    expect(fotos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: foto1.id }),
        expect.objectContaining({ id: foto2.id }),
      ]),
    );
  });

  it('findAllFotos should handle errors', async () => {
    jest
      .spyOn(repository, 'find')
      .mockRejectedValueOnce(new Error('Database connection error'));

    await expect(service.findAllFotos()).rejects.toThrow(
      'Database connection error',
    );
  });
});
