import { Entity } from "../../domain/entity"
import { IRepository } from "../../domain/repository/repository.interface"
import { ValueObject } from "../../domain/value-object"
import { NotFoundError } from "./not-found.error"

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject
> implements IRepository<E, EntityId>
{
  items: E[] = []

  async insert(entity: E): Promise<void> {
    this.items.push(entity)
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities)
  }

  async update(entity: E): Promise<void> {
    const indexFound = this._findIndex(entity.entity_id as EntityId)
    this.items[indexFound] = entity
  }

  async bulkUpdate(entites: E[]): Promise<void> {
    entites.forEach((entity) => {
      const indexFound = this._findIndex(entity.entity_id as EntityId)
      this.items[indexFound] = entity
    })
  }

  async delete(entity_id: EntityId): Promise<void> {
    const indexFound = this._findIndex(entity_id)
    this.items.splice(indexFound, 1)
  }

  async findById(entity_id: EntityId): Promise<E> {
    return this._get(entity_id)
  }

  async findAll(): Promise<E[]> {
    return this.items
  }
  abstract getEntity(): new (...args: any[]) => E

  protected _get(entity_id: EntityId) {
    const item = this.items.find((item) => item.entity_id.equals(entity_id))
    return typeof item === "undefined" ? null : item
  }

  protected _findIndex(entity_id: EntityId) {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entity_id)
    )
    if (indexFound === -1) {
      throw new NotFoundError(entity_id, this.getEntity())
    }
    return indexFound
  }
}
