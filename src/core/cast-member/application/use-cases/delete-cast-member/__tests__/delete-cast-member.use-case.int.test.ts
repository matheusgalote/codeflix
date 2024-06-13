import { CastMemberSequelizeRepository } from "@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository"
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import { setupSequelize } from "../../../../../shared/infra/testing/helpers"
import { DeleteCastMemberUseCase } from "../delete-cast-member.use-case"
import { CastMemberModel } from "@core/cast-member/infra/db/sequelize/cast-member.model"
import {
  CastMember,
  CastMemberId,
} from "@core/cast-member/domain/cast-member.aggregate"

describe("DeleteCategoryUseCase Integration Tests", () => {
  let useCase: DeleteCastMemberUseCase
  let repository: CastMemberSequelizeRepository

  setupSequelize({ models: [CastMemberModel] })

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel)
    useCase = new DeleteCastMemberUseCase(repository)
  })

  test("should throws error when entity not found", async () => {
    const uuid = new CastMemberId()
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    )
  })

  test("should delete a cast member", async () => {
    const castMember = CastMember.fake().aCastMember().build()
    await repository.insert(castMember)
    await useCase.execute({
      id: castMember.castmember_id.id,
    })
    await expect(
      repository.findById(castMember.castmember_id),
    ).resolves.toBeNull()
  })
})
