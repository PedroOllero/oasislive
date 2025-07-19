import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller.js';
import { ImagesService } from './images.service.js';
import { Image } from './image.entity.js';
import { House } from '../houses/house.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Image, House])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}