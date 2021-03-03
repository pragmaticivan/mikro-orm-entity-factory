/** Private access symbol */
import {
  Constructor,
  Dictionary,
  EntityMetadata,
  MetadataStorage,
  EntitySchema,
  AnyEntity,
} from '@mikro-orm/core';
import { EntityFactory } from './entity-factory';
import { EntityClass } from '@mikro-orm/core/typings';

const factoryForKey = Symbol('mikro-orm-entity-factory:FactoryFor');

/**
 * The FactoryContainer maps entity class name strings
 * to their respective factory classes.
 *
 * @example
 * class Book {...}
 *
 * @FactoryFor(Book)
 * class BookFactory {...}
 *
 * Then within the container, the class name passed
 * into factory for is retrieve and mapped.
 *
 * @param entity: The entity class to map to in container
 * @param namespaceKey: A namespacing string to allow for multiple factories for the same entity
 * @returns TS class decorator function
 */
export const FactoryFor = <T extends AnyEntity>(
  entity: EntityClass<T>,
  namespaceKey = '',
) => (target: Constructor<EntityFactory<T>>) => {
    const entityName: string = entity.name;
    const targetName: string = target.name;
    // const targetClass = target as unknown as Constructor<EntityFactory<T>>;

    const schema = new EntitySchema<
    EntityFactory<EntityClass<T>>,
    EntityClass<T>
    >({
      name: targetName,
      extends: entityName,
    });
    const { meta } = schema.init();
    // eslint-disable-next-line no-underscore-dangle
    const metadataStorage = entity.prototype.__helper.__em.getMetadata();
    metadataStorage.set(meta.className, meta);

  // const meta : EntityMetadata = MetadataStorage.getMetadataFromDecorator(schema);
  // let path = (entity as Dictionary);
  // const meta = MetadataStorage.getMetadata(entityName, (entity as Dictionary).__path);
  // meta.namespace = namespaceKey;
  // meta.class = targetClass;
  // meta.className = entityName;
  // meta.name = entityName;
  // Reflect.defineMetadata(factoryForKey, { entityName, namespaceKey }, target);
  };

export function getFactoryFor(
  target: any,
): { entityName: string; namespaceKey: string } {
  // const meta = MetadataStorage.getMetadata(entity.name, (entity as Dictionary).__path);
  const targetMeta: EntityMetadata = MetadataStorage.getMetadataFromDecorator(
    target,
  );
  const allMeta: Dictionary<EntityMetadata> = MetadataStorage.getMetadata();
  const factoryMetas = Object.values(allMeta).filter(
    (metadata: EntityMetadata) => metadata.extends === targetMeta.name
      && metadata.class.prototype instanceof EntityFactory,
  );
  const factoryName = factoryMetas ? factoryMetas[0].name || '' : '';
  return { entityName: factoryName, namespaceKey: '' };

  // return Reflect.getMetadata(factoryForKey, target);
}
