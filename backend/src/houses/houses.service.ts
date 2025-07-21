import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from './house.entity';
import { Image } from '../images/image.entity';
import { ImagesService } from '../images/images.service';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly imagesService: ImagesService,
  ) {}

  async getAllHouses(): Promise<House[]> {
    return this.houseRepository.find({ relations: ['images'] });
  }

  async getHouseById(id: number): Promise<House> {
    const house = await this.houseRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!house) {
      throw new NotFoundException('House not found');
    }
    return house;
  }

  async insertHouse(houseData: Partial<House>): Promise<number> {
    const newHouse = this.houseRepository.create(houseData);
    const saved = await this.houseRepository.save(newHouse);
    return saved.id;
  }

  async insertHouseImages(
    houseId: number,
    images: Partial<Image>[],
  ): Promise<void> {
    const house = await this.getHouseById(houseId);
    const imageEntities = images.map((img) =>
      this.imageRepository.create({
        ...img,
        house,
      }),
    );
    await this.imageRepository.save(imageEntities);
  }

  async updateHouseById(
    id: number,
    houseData: Partial<House>,
  ): Promise<boolean> {
    const result = await this.houseRepository.update(id, houseData);
    return result.affected > 0;
  }

  async deleteHouseById(id: number): Promise<boolean> {
    await this.imagesService.deleteImagesByHouseId(id);
    const result = await this.houseRepository.delete(id);
    return result.affected > 0;
  }
}
