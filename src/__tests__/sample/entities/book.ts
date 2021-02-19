import {
  Entity, PrimaryKey, Property, ManyToOne,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Genre } from './genre';

@Entity()
export class Book {
  @PrimaryKey()
  id: string = v4();

  @Property({
    length: 255,
    name: 'title',
  })
  title: string;

  @ManyToOne({ entity: () => Genre })
  genre: Genre;
}
