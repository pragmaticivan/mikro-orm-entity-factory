import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/core';
import { Genre } from './genre';
import { v4 } from 'uuid';

@Entity()
export class Book {
  @PrimaryKey()
  id: string = v4();

  @Property({
    length: 255,
    name: 'title'
  })
  title: string;

  @ManyToOne({entity: () => Genre})
  genre: Genre;
}
