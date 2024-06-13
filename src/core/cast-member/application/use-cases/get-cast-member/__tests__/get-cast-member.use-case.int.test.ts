import { CastMemberSequelizeRepository } from "@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository"
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import { setupSequelize } from "../../../../../shared/infra/testing/helpers"
import { GetCastMemberUseCase } from "../get-cast-member.use-case"
import { CastMemberModel } from "@core/cast-member/infra/db/sequelize/cast-member.model"
import {
  CastMember,
  CastMemberId,
} from "@core/cast-member/domain/cast-member.aggregate"
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"

describe("GetCategoryUseCase Integration Tests", () => {
  let useCase: GetCastMemberUseCase
  let repository: CastMemberSequelizeRepository

  setupSequelize({ models: [CastMemberModel] })

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel)
    useCase = new GetCastMemberUseCase(repository)
  })

  test("should throws error when entity not found", async () => {
    const uuid = new CastMemberId()
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    )
  })

  test("should returns a cast member", async () => {
    const castMember = CastMember.fake()
      .aCastMember()
      .withType(new CastMemberType(1))
      .build()
    await repository.insert(castMember)
    const output = await useCase.execute({ id: castMember.castmember_id.id })
    expect(output).toStrictEqual({
      id: castMember.castmember_id.id,
      name: castMember.name,
      type: "Director",
      created_at: castMember.created_at,
    })
  })
})
