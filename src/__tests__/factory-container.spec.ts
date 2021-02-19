import { Connection, EntityManager, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { FactoryContainer } from 'src/factory-container';
import { getConnectionOrm, clearDB, getContainer } from './test-utils';
import { Book } from './sample/entities/book';
import { Genre } from './sample/entities/genre';
import { Author } from './sample/entities/author';

class FakeEntity {}

describe('entity-factory', () => {
  let orm: MikroORM<IDatabaseDriver<Connection>>
  let em: EntityManager;
  let container: FactoryContainer;

  beforeAll(async () => {
    orm = await getConnectionOrm();
    em = orm.em;
    container = await getContainer(orm.em);
  });

  afterAll(async () => {
    if (await orm.isConnected()) {
      await orm.close();
    }
  });

  it('can provide for factories with init()', async () => {
    const bookFactory = container.getFactory(Book);
    const genreFactory = container.getFactory(Genre);
    const authorFactory = container.getFactory(Author);
    const famousAuthorFactory = container.getFactory(Author, 'famous');

    expect(bookFactory).toBeDefined();
    expect(genreFactory).toBeDefined();
    expect(authorFactory).toBeDefined();
    expect(famousAuthorFactory).toBeDefined();
    // @ts-ignore TS2345 (Ignore private method)
    expect(bookFactory.faker).toBeDefined();
    // @ts-ignore TS2345 (Ignore private method)
    expect(genreFactory.faker).toBeDefined();
  });

  it('throws error when entity does not exist', async () => {
    let thrownError = null;
    try {
      container.getFactory(FakeEntity);
    } catch (e) {
      thrownError = e;
    }

    expect(thrownError).toBeDefined();
    expect(
      thrownError.message.indexOf(
        'Unable to retrieve factory instance for key: FakeEntity',
      ),
    ).toBeGreaterThanOrEqual(0);
  });
});
