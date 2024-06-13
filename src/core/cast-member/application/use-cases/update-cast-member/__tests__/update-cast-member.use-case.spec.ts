import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository"
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import { InvalidUuidError } from "../../../../../shared/domain/value-objects/uuid.vo"
import { UpdateCastMemberUseCase } from "../update-cast-member.use-case"
import {
  CastMember,
  CastMemberId,
} from "@core/cast-member/domain/cast-member.aggregate"
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"

describe("UpdateCategoryUseCase Unit Tests", () => {
  let useCase: UpdateCastMemberUseCase
  let repository: CastMemberInMemoryRepository

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository()
    useCase = new UpdateCastMemberUseCase(repository)
  })

  test("should throw an error when aggregate is not valid", async () => {
    const aggregate = new CastMember({
      name: "mov",
      type: new CastMemberType(1),
    })
    repository.items = [aggregate]

    await expect(() =>
      useCase.execute({
        id: aggregate.castmember_id.id,
        name: "t".repeat(256),
      }),
    ).rejects.toThrow("Entity Validation Error")
  })

  test("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id", name: "fake" }),
    ).rejects.toThrow(new InvalidUuidError())

    const uuid = new CastMemberId()

    await expect(() =>
      useCase.execute({ id: uuid.id, name: "fake" }),
    ).rejects.toThrow(new NotFoundError(uuid.id, CastMember))
  })

  test("should update a category", async () => {
    const spyUpdate = jest.spyOn(repository, "update")
    const entity = new CastMember({
      name: "Movie",
      type: new CastMemberType(1),
    })
    repository.items = [entity]

    let output = await useCase.execute({
      id: entity.castmember_id.id,
      name: "test",
    })
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: entity.castmember_id.id,
      name: "test",
      type: "Director",
      created_at: entity.created_at,
    })

    type Arrange = {
      input: {
        id: string
        name?: string
        type?: null | number
      }
      expected: {
        id: string
        name: string
        type: null | string
        created_at: Date
      }
    }
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.castmember_id.id,
          name: "test 2",
          type: 1,
        },
        expected: {
          id: entity.castmember_id.id,
          name: "test 2",
          type: "Director",
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.castmember_id.id,
          name: "test",
          type: 2,
        },
        expected: {
          id: entity.castmember_id.id,
          name: "test",
          type: "Actor",
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.castmember_id.id,
          type: 2,
        },
        expected: {
          id: entity.castmember_id.id,
          name: "test",
          type: "Actor",
          created_at: entity.created_at,
        },
      },
    ]

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...("name" in i.input && { name: i.input.name }),
        ...("type" in i.input && { type: i.input.type }),
      })
      expect(output).toStrictEqual({
        id: entity.castmember_id.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      })
    }
  })
})
