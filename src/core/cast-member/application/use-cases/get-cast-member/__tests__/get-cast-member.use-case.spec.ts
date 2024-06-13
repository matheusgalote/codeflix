import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository"
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import { InvalidUuidError } from "../../../../../shared/domain/value-objects/uuid.vo"
import { GetCastMemberUseCase } from "../get-cast-member.use-case"
import {
  CastMember,
  CastMemberId,
} from "@core/cast-member/domain/cast-member.aggregate"
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"

describe("GetCastMemberUseCase Unit Tests", () => {
  let useCase: GetCastMemberUseCase
  let repository: CastMemberInMemoryRepository

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository()
    useCase = new GetCastMemberUseCase(repository)
  })

  test("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new InvalidUuidError(),
    )

    const uuid = new CastMemberId()
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    )
  })

  test("should returns a cast member", async () => {
    const items = [
      CastMember.create({ name: "Joe", type: new CastMemberType(2) }),
    ]
    repository.items = items
    const spyFindById = jest.spyOn(repository, "findById")
    const output = await useCase.execute({ id: items[0].castmember_id.id })
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: items[0].castmember_id.id,
      name: "Joe",
      type: "Actor",
      created_at: items[0].created_at,
    })
  })
})
