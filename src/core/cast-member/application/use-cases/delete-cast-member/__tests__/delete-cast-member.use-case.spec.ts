import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository"
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo"
import { DeleteCastMemberUseCase } from "../delete-cast-member.use-case"
import { CastMember } from "@core/cast-member/domain/cast-member.aggregate"

describe("DeleteCategoryUseCase Unit Tests", () => {
  let useCase: DeleteCastMemberUseCase
  let repository: CastMemberInMemoryRepository

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository()
    useCase = new DeleteCastMemberUseCase(repository)
  })

  test("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new InvalidUuidError(),
    )

    const uuid = new Uuid()

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    )
  })

  test("should delete a cast member", async () => {
    const items = [CastMember.fake().aCastMember().withName("test 1").build()]
    repository.items = items
    await useCase.execute({
      id: items[0].castmember_id.id,
    })
    expect(repository.items).toHaveLength(0)
  })
})
