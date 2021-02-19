import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
} from '@mikro-orm/core';
import { Book } from './book';

@Entity()
export class Author {
  @PrimaryKey()
  id: string;

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
