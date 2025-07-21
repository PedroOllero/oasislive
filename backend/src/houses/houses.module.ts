import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousesController } from './houses.controller.js';
import { HousesService } from './houses.service.js';
import { House } from './house.entity.js';
import { Image } from '../images/image.entity.js';
import { ImagesModule } from '../images/images.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([House, Image]),
    ImagesModule, // ✅ importa el módulo aquí
  ],
  controllers: [HousesController],
  providers: [HousesService],
  exports: [HousesService],
})
export class HousesModule {}
