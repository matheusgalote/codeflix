import { Entity } from "../../domain/entity"
import { Uuid } from "../../domain/value-objects/uuid.vo"
import { InMemoryRepository } from "./in-memory.repository"
import { NotFoundError } from "./not-found.error"

type StubEntityConstructorProps = {
  entity_id?: Uuid
  name: string
  price: number
}

class StubEntity extends Entity {
  entity_id: Uuid
  name: string
  price: number

  constructor(props: StubEntityConstructorProps) {
    super()
    this.entity_id = props.entity_id || new Uuid()
    this.name = props.name
    this.price = props.price
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    }
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repo: StubInMemoryRepository

  beforeEach(() => {
    repo = new StubInMemoryRepository()
  })

  test("should insert a new entity", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "test",
      price: 100,
    })

    await repo.insert(entity)

    expect(repo.items.length).toEqual(1)
    expect(repo.items[0]).toEqual(entity)
  })

  test("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: "test",
        price: 100,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: "test 2",
        price: 200,
      }),
    ]

    await repo.bulkInsert(entities)

    expect(repo.items.length).toEqual(2)
    expect(repo.items[0]).toEqual(entities[0])
    expect(repo.items[1]).toEqual(entities[1])
  })

  test("should returns all entities", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 })
    await repo.insert(entity)

    const entities = await repo.findAll()

    expect(entities).toStrictEqual([entity])
  })

  test("should throws error on update when entity not found", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 })
    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    )
  })

  test("should updates an entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 })
    await repo.insert(entity)

    const entityUpdated = new StubEntity({
      entity_id: entity.entity_id,
      name: "updated",
      price: 1,
    })

    await repo.update(entityUpdated)

    expect(entityUpdated.toJSON()).toStrictEqual(repo.items[0].toJSON())
  })

  test("should bulk update entities", async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: "test",
        price: 100,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: "test 2",
        price: 200,
      }),
    ]

    await repo.bulkInsert(entities)

    const entitesUpdate = [
      new StubEntity({
        entity_id: entities[0].entity_id,
        name: "test01",
        price: 150,
      }),
      new StubEntity({
        entity_id: entities[1].entity_id,
        name: "test02",
        price: 250,
      }),
    ]

    await repo.bulkUpdate(entitesUpdate)

    expect(entitesUpdate[0].toJSON()).toStrictEqual(repo.items[0].toJSON())
    expect(entitesUpdate[1].toJSON()).toStrictEqual(repo.items[1].toJSON())
  })

  test("should throws error on delete when entity not found", async () => {
    const uuid = new Uuid()
    await expect(repo.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid.id, StubEntity)
    )

    await expect(
      repo.delete(new Uuid("9366b7dc-2d71-4799-b91c-c64adb205104"))
    ).rejects.toThrow(
      new NotFoundError("9366b7dc-2d71-4799-b91c-c64adb205104", StubEntity)
    )
  })

  test("should deletes an entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 })
    await repo.insert(entity)

    await repo.delete(entity.entity_id)
    expect(repo.items).toHaveLength(0)
  })
})
