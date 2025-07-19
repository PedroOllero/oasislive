import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post(':houseId')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('houseId') houseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await this.imagesService.uploadImage(
        +houseId,
        file.buffer,
        file.originalname,
      );

      res.status(200).json({
        message: 'Image uploaded and saved to house',
        url: result.url,
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  @Get(':id')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    try {
      const images = await this.imagesService.getImagesByHouseId(+id);
      if (!images || images.length === 0) {
        return res
          .status(404)
          .json({ error: 'No images found for this house' });
      }
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
