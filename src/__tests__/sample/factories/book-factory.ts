import { EntityFactory } from '../../../entity-factory';
import { FactoryFor } from '../../../factory-for.decorator';
import { Book } from '../entities/book';
import { Genre } from '../entities/genre';

@FactoryFor(Book)
export class BookFactory extends EntityFactory<Book> {
  /**
   * @inheritdoc
   * Create a Book with default parameters
   * @returns a stubbed Book
   */
  async make(): Promise<Book> {
    const book = new Book();
    book.id = this.faker.random.uuid();
    book.title = this.faker.name.title();
    book.genre = await this.container.getFactory(Genre).saveOne();
    return book;
  }
}
