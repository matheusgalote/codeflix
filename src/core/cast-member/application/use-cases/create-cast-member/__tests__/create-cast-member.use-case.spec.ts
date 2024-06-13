import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository"
import { CreateCastMemberUseCase } from "../create-cast-member.use-case"
import { InvalidCastMemberTypeError } from "@core/cast-member/domain/cast-member-type.vo"

describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: CreateCastMemberUseCase
  let repository: CastMemberInMemoryRepository

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository()
    useCase = new CreateCastMemberUseCase(repository)
  })

  test("should throw a error if pass wrong cast member type", async () => {
    expect(useCase.execute({ name: "test", type: 3 })).rejects.toThrow(
      new InvalidCastMemberTypeError(),
    )
  })
  test("should throw an error when aggregate is not valid", async () => {
    const input = { name: "t".repeat(256), type: 2 }
    await expect(() => useCase.execute(input)).rejects.toThrow(
      "Entity Validation Error",
    )
  })

  test("should create a cast member", async () => {
    const spyInsert = jest.spyOn(repository, "insert")
    let output = await useCase.execute({ name: "test", type: 2 })
    expect(spyInsert).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: repository.items[0].castmember_id.id,
      name: "test",
      type: "Actor",
      created_at: repository.items[0].created_at,
    })

    output = await useCase.execute({
      name: "test",
      type: 1,
    })
    expect(spyInsert).toHaveBeenCalledTimes(2)
    expect(output).toStrictEqual({
      id: repository.items[1].castmember_id.id,
      name: "test",
      type: "Director",
      created_at: repository.items[1].created_at,
    })
  })
})
