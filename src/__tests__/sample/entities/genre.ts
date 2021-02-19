import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Genre {
  @PrimaryKey()
  id: string;

  @Property({
    length: 255,
    name: 'name'
  })
  name: string;
}
