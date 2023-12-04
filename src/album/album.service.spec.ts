import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity/album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils';
import { faker } from '@faker-js/faker';
import { FotoEntity } from '../foto/foto.entity/foto.entity';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let fotoRepository: Repository<FotoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    fotoRepository = module.get<Repository<FotoEntity>>(
      getRepositoryToken(FotoEntity),
    );
  });

  it('deleteAlbum should remove an album', async () => {
    const albumData = {
      titulo: faker.lorem.word(),
      fechaInicio: faker.date.past().toISOString().split('T')[0],
      fechaFin: faker.date.future().toISOString().split('T')[0],
    };
    const album = repository.create(albumData);
    await repository.save(album);

    const storedAlbum = await repository.findOne({ where: { id: album.id } });
    expect(storedAlbum).not.toBeNull();

    await service.deleteAlbum(album.id);

    const deletedAlbum = await repository.findOne({ where: { id: album.id } });
    expect(deletedAlbum).toBeNull();
  });

  it('deleteAlbum should fail for non-existent album', async () => {
    const nonExistentId = -1;

    await expect(service.deleteAlbum(nonExistentId)).rejects.toHaveProperty(
      'message',
      'Álbum con ID -1 no encontrado',
    );
  });

  it('createAlbum should return a new album', async () => {
    const albumData = {
      titulo: faker.lorem.word(),
      fechaInicio: faker.date.past().toISOString().split('T')[0],
      fechaFin: faker.date.future().toISOString().split('T')[0],
    };

    const newAlbum: AlbumEntity = await service.createAlbum(albumData);
    expect(newAlbum).not.toBeNull();

    const storedAlbum: AlbumEntity = await repository.findOne({
      where: { id: newAlbum.id },
    });
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.titulo).toEqual(newAlbum.titulo);
    expect(storedAlbum.fechaInicio).toEqual(newAlbum.fechaInicio);
    expect(storedAlbum.fechaFin).toEqual(newAlbum.fechaFin);
  });

  it('createAlbum should fail with invalid data', async () => {
    const invalidAlbumData = {
      titulo: '',
      fechaInicio: faker.date.past().toISOString().split('T')[0],
      fechaFin: faker.date.future().toISOString().split('T')[0],
    };

    await expect(service.createAlbum(invalidAlbumData)).rejects.toHaveProperty(
      'message',
      'El título no puede estar vacío',
    );
  });

  it('findAlbumById should return an album', async () => {
    const albumData = {
      titulo: faker.lorem.word(),
      fechaInicio: faker.date.past().toISOString().split('T')[0],
      fechaFin: faker.date.future().toISOString().split('T')[0],
    };
    const album = repository.create(albumData);
    await repository.save(album);

    const foundAlbum = await service.findAlbumById(album.id);
    expect(foundAlbum).not.toBeNull();
    expect(foundAlbum.id).toEqual(album.id);
  });

  it('findAlbumById should fail for non-existent album', async () => {
    const nonExistentId = -1;

    await expect(service.findAlbumById(nonExistentId)).rejects.toHaveProperty(
      'message',
      'Álbum con ID -1 no encontrado',
    );
  });

  it('addPhotoToAlbum should successfully add a photo to an album', async () => {
    const albumData = {
      titulo: faker.lorem.word(),
      fechaInicio: faker.date.past().toISOString().split('T')[0],
      fechaFin: faker.date.future().toISOString().split('T')[0],
    };
    const album = repository.create(albumData);
    await repository.save(album);

    const fotoData = {
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      albumId: faker.string.uuid(),
      fecha: faker.date.recent().toISOString(),
    };
    const photo = fotoRepository.create(fotoData);
    await fotoRepository.save(photo);

    const updatedAlbum = await service.addPhotoToAlbum(album.id, photo.id);

    expect(updatedAlbum.fotos).toContainEqual(
      expect.objectContaining({ id: photo.id }),
    );
  });
  it('addPhotoToAlbum should fail if the photo date is out of the album date range', async () => {
    const albumData = {
      titulo: faker.lorem.word(),
      fechaInicio: '2021-01-01',
      fechaFin: '2021-12-31',
    };
    const album = repository.create(albumData);
    await repository.save(album);

    const fotoData = {
      ISO: faker.number.int({ min: 100, max: 6400 }),
      velObturacion: faker.number.int({ min: 2, max: 250 }),
      apertura: faker.number.int({ min: 1, max: 32 }),
      albumId: faker.string.uuid(),
      fecha: '2022-01-01',
    };
    const photo = fotoRepository.create(fotoData);
    await fotoRepository.save(photo);

    await expect(
      service.addPhotoToAlbum(album.id, photo.id),
    ).rejects.toHaveProperty(
      'message',
      'La fecha de la foto no está dentro del rango del álbum',
    );
  });
});
