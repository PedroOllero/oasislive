import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './houses/house.entity';
import { Image } from './images/image.entity';
import { HousesModule } from './houses/houses.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/realestate.sqlite',
      entities: [House, Image],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([House, Image]),
    HousesModule,
    ImagesModule,
  ],
})
export class AppModule {}
