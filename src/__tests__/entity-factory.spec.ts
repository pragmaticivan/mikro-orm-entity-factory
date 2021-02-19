import * as faker from 'faker';
import { Connection, EntityManager, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { clearDB, getContainer, getConnectionOrm, loadSchema } from './test-utils';
import { Book } from './sample/entities/book';
import { BookFactory } from './sample/factories/book-factory';
import { FactoryContainer } from 'src/factory-container';

describe('entity-factory', () => {
  let bookFactory: BookFactory;
  let orm: MikroORM<IDatabaseDriver<Connection>>
  let em: EntityManager;
  let container: FactoryContainer;

  beforeAll(async () => {
    orm = await getConnectionOrm();
    await loadSchema(orm);
    em = orm.em;
    container = await getContainer(em);
    bookFactory = container.getFactory(Book);
  });

  afterEach(async () => clearDB(em));

  afterAll(async () => {
    await clearDB(em);
    if (await orm.isConnected()) {
      await orm.close();
    }
  });

  describe('saveOne()', () => {
    describe('bookFactory', () => {
      it('can bulk instantiate entities', async () => {
        const book = await bookFactory.saveOne();
        expect(book.id).toBeDefined();
        expect(book.title).toBeDefined();
        expect(book.genre).toBeDefined();

        const [
          savedBooks,
          savedBooksCount,
        ] = await em.findAndCount(Book, {}, {
          populate: ['genre'],
        });

        /** Check that the database has been updated with the new book */
        expect(savedBooksCount).toBe(1);
        expect(savedBooksCount).toEqual(savedBooks.length);
        for (const savedBook of savedBooks) {
          expect(savedBook.id).toBeDefined();
          expect(savedBook.title).toBeDefined();
          expect(savedBook.genre).toBeDefined();
        }
      });

      it('can instantiate a book with partial parameters', async () => {
        const BOOK_TITLE: string = faker.random.words();
        const BOOK_COUNT: number = 10;
        const book = await bookFactory.saveOne({
          title: BOOK_TITLE,
        });

        await bookFactory.saveMany(10, {
          title: BOOK_TITLE,
        });

        expect(book).toBeDefined();
        expect(book.title).toEqual(BOOK_TITLE);

        const [savedBooks, count] = await em.findAndCount(
          Book,
          {
            title: BOOK_TITLE,
          }
        );
        expect(count).toBe(BOOK_COUNT + 1);

        savedBooks.forEach(savedBook => {
          expect(savedBook).not.toBeNull();
          expect(savedBook.title).toEqual(BOOK_TITLE);
        });
      });
    });
  });

  describe('saveMany()', () => {
    describe('bookFactory', () => {
      it('can bulk instantiate entities', async () => {
        const BOOKS_COUNT = 100;

        const books = await bookFactory.saveMany(BOOKS_COUNT);

        /** Instantiate a large amount of books */
        expect(books.length).toBe(BOOKS_COUNT);
        books.forEach(book => {
          expect(book.id).toBeDefined();
          expect(book.title).toBeDefined();
        });

        const [
          savedBooks,
          savedBooksCount,
        ] = await em.findAndCount(Book, {});

        /** Check that the saved books are saved and defined */
        expect(savedBooksCount).toEqual(BOOKS_COUNT);
        expect(savedBooksCount).toEqual(savedBooks.length);
        for (const book of savedBooks) {
          expect(book.id).toBeDefined();
          expect(book.title).toBeDefined();
        }
      });
    });
  });
});
