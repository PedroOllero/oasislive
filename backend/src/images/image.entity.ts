import { House } from '../houses/house.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  alt: string;

  @Column({ type: 'int', default: 0 })
  order_index: number;

  @ManyToOne(() => House, (house) => house.images, { onDelete: 'CASCADE' })
  house: House;
}