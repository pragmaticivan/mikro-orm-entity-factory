import { EntityManager } from '@mikro-orm/core';
import { EntityFactory } from './entity-factory';

/**
 * @interface
 * @summary
 * An interface for the types of options to be passed into
 * the FactoryContainer on init. It is important that the connection
 * actually has access to create these entities. In the case
 * of two databases, two separate factory containers with
 * their own
 *
 * @property em: The MikroORM Etity Manager
 * @property factories: Array of factory classes to instantiate
 * @property debug: Flag for console.logging errors and other init logs
 */
export interface IFactoryContainerOptions {
  em: EntityManager;
  factories: { new (...args: any[]): EntityFactory<any> }[];
}
