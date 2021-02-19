import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Genre {
  @PrimaryKey()
  id: string = v4();

  @Property({
    length: 255,
    name: 'name',
  })
  name: string;
}
