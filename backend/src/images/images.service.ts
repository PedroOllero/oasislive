import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import cloudinary from '../utils/cloudinary';
import { Image } from './image.entity.js';
import { House } from '../houses/house.entity.js';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
  ) {}

  async uploadImage(houseId: number, fileBuffer: Buffer, fileName: string) {
    const house = await this.houseRepository.findOne({
      where: { id: +houseId },
    });
    if (!house) {
      throw new NotFoundException('House not found');
    }

    return new Promise<{ url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'houses', public_id: fileName },
        async (error, result) => {
          if (error) {
            return reject(error);
          }

          try {
            const image = this.imageRepository.create({
              url: result.secure_url,
              house,
            });
            await this.imageRepository.save(image);
            resolve({ url: result.secure_url });
          } catch (dbError) {
            reject(dbError);
          }
        },
      );

      stream.end(fileBuffer);
    });
  }

  async getImagesByHouseId(houseId: number) {
    const house = await this.houseRepository.findOne({
      where: { id: +houseId },
      relations: ['images'],
    });

    if (!house) {
      throw new NotFoundException('House not found');
    }

    return house.images;
  }

  private extractPublicIdFromUrl(url: string): string | null {
    const match = url.match(/\/v\d+\/(.+)\.[a-z]+$/);
    return match ? match[1] : null;
  }

  async deleteImagesByHouseId(houseId: number) {
    const images = await this.imageRepository.find({
      where: { house: { id: houseId } },
    });

    for (const img of images) {
      const publicId = this.extractPublicIdFromUrl(img.url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await this.imageRepository.delete({ house: { id: houseId } });
  }

  async deleteImageById(imageId: number) {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const publicId = this.extractPublicIdFromUrl(image.url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await this.imageRepository.delete(imageId);
  }
}
