import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from '@mikro-orm/core';
import { FactoryContainer } from '../factory-container';
import { GenreFactory } from './sample/factories/genre-factory';
import { BookFactory } from './sample/factories/book-factory';
import { AuthorFactory } from './sample/factories/author-factory';
import { FamousAuthorFactory } from './sample/factories/famous-author-factory';
import { Genre } from './sample/entities/genre';
import { Author } from './sample/entities/author';
import { Book } from './sample/entities/book';

/**
 * Get a sample database connection for a fake postgres database
 * @returns an instantiated database connection string
 */
export const getConnectionOrm = async () => MikroORM.init({
  type: 'postgresql',
  host: process.env.ENVIRONMENT === 'ci' ? 'localhost' : 'db',
  port: 5432,
  user: 'postgres',
  password: 'example',
  dbName: 'postgres',
  debug: false,
  entities: [Book, Genre, Author],
});

/**
 * Get all of the database entities associated with a database connection
 *
 * @param connection: A database connection string
 * @returns an array of objects for name and table name
 */
export const getDBEntities = (
  em: EntityManager,
): { name: string; tableName: string }[] => {
  const entities: { name: string; tableName: string }[] = [];
  const metadata = em.getMetadata().getAll();
  Object.keys(metadata).forEach(key => {
    entities.push({
      // @ts-ignore
      name: metadata[key].name,
      tableName: metadata[key].tableName,
    });
  });
  return entities;
};

/**
 * Clear all database tables via connection
 *
 * @param connection: Database connection clear
 * @returns a promise that the Database has been cleared
 */
export const clearDB = async (em: EntityManager): Promise<void> => {
  try {
    for await (const entity of getDBEntities(em)) {
      const repository = em.getRepository(entity.name);
      await repository.nativeDelete({});
    }
  } catch (err) {
    throw new Error(`ERROR: Cleaning test db: ${err}`);
  }
};

export const loadSchema = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,
): Promise<void> => {
  const generator = orm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.createSchema();
};

/**
 * Get a stub factory container for testing
 * @returns an instantiated container
 */
export const getContainer = async (
  em: EntityManager,
): Promise<FactoryContainer> => FactoryContainer.init({
  em,
  factories: [BookFactory, GenreFactory, AuthorFactory, FamousAuthorFactory],
});
