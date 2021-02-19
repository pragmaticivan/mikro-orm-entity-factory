import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
} from '@mikro-orm/core';
import { Book } from './book';
import { v4 } from 'uuid';

@Entity()
export class Author {
  @PrimaryKey()
  id: string = v4();

  @Property({
    length: 255,
    name: 'first_name'
  })
  firstName: string;

  @Property({
    length: 255,
    name: 'last_name'
  })
  lastName: string;

  @ManyToMany({entity: () => Book})
  books: Book[];
}
