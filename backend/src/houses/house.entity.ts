import { Image } from '../images/image.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class House {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('integer')
  price: number;

  @Column('text')
  description: string;

  @Column('text')
  flat: string;

  @Column()
  address: string;

  @Column()
  mapAddress: string;

  @Column('integer')
  bedrooms: number;

  @Column('integer')
  bathrooms: number;

  @Column('integer')
  total_area: number;

  @Column('integer')
  living_area: number;

  @Column('integer')
  construction_year: number;

  @Column({ default: true })
  active: boolean;

  @Column({ default: true })
  rentable: boolean;

  @Column({ default: false })
  accesible: boolean;

  @Column({ default: false })
  garage: boolean;

  @Column({ default: false })
  pet: boolean;

  @Column({ default: false })
  garden: boolean;

  @Column({ default: false })
  furnished: boolean;

  @Column({ default: false })
  heating: boolean;

  @Column({ default: false })
  airConditioned: boolean;

  @Column({ default: false })
  terrace: boolean;

  @OneToMany(() => Image, (image) => image.house, { cascade: true })
  images: Image[];
}
