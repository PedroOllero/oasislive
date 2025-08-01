import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HousesService } from './houses.service';
import { ImagesService } from '../images/images.service';

@Controller('houses')
export class HousesController {
  constructor(
    private readonly housesService: HousesService,
    private readonly imagesService: ImagesService, // ✅ Inyección añadida
  ) {}

  @Get()
  async listHouses() {
    return await this.housesService.getAllHouses();
  }

  @Get(':id')
  async getHouse(@Param('id') id: string) {
    const house = await this.housesService.getHouseById(+id);
    if (!house) {
      throw new HttpException('House not found', HttpStatus.NOT_FOUND);
    }
    return house;
  }

  @Post()
  async createHouse(@Body() body) {
    try {
      const houseId = await this.housesService.insertHouse(body);
      if (body.images && body.images.length > 0) {
        await this.housesService.insertHouseImages(houseId, body.images);
      }
      return {
        id: houseId,
        message: 'House created successfully',
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Failed to create house',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateHouse(@Param('id') id: string, @Body() body) {
    try {
      const updated = await this.housesService.updateHouseById(+id, body);
      if (!updated) {
        throw new HttpException('House not found', HttpStatus.NOT_FOUND);
      }

      if (body.images && body.images.length > 0) {
        await this.housesService.insertHouseImages(+id, body.images);
      }

      return { message: 'House updated successfully' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error(error); // <--- Añade esto
      throw new HttpException(
        'Failed to update house',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteHouse(@Param('id') id: string) {
    try {
      const deleted = await this.housesService.deleteHouseById(+id);
      if (!deleted) {
        throw new HttpException('House not deleted', HttpStatus.NOT_FOUND);
      }
      return { message: 'House deleted successfully' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Failed to delete house',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('image/:id')
  async deleteImage(@Param('id') id: string) {
    try {
      await this.imagesService.deleteImageById(+id);
      return { message: 'Image deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to delete image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
