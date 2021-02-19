import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/core';
import { Genre } from './genre';

@Entity()
export class Book {
  @PrimaryKey()
  id: string;

  @Property({
    length: 255,
    name: 'title'
  })
  title: string;

  @ManyToOne({entity: () => Genre})
  genre: Genre;
}
