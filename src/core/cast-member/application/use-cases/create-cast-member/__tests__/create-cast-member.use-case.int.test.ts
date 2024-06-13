import { CategoryId } from "@core/category/domain/category.aggregate"
import { setupSequelize } from "../../../../../shared/infra/testing/helpers"
import { CreateCastMemberUseCase } from "../create-cast-member.use-case"
import { CastMemberSequelizeRepository } from "@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository"
import { CastMemberModel } from "@core/cast-member/infra/db/sequelize/cast-member.model"
import { InvalidCastMemberTypeError } from "@core/cast-member/domain/cast-member-type.vo"

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: CreateCastMemberUseCase
  let repository: CastMemberSequelizeRepository

  setupSequelize({ models: [CastMemberModel] })

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel)
    useCase = new CreateCastMemberUseCase(repository)
  })

  test("should throw a error if pass wrong cast member type", async () => {
    expect(useCase.execute({ name: "test", type: 3 })).rejects.toThrow(
      new InvalidCastMemberTypeError(),
    )
  })

  test("should create a cast member", async () => {
    let output = await useCase.execute({ name: "test", type: 1 })
    let entity = await repository.findById(new CategoryId(output.id))
    expect(output).toStrictEqual({
      id: entity.castmember_id.id,
      name: "test",
      type: "Director",
      created_at: entity.created_at,
    })

    output = await useCase.execute({
      name: "test",
      type: 2,
    })
    entity = await repository.findById(new CategoryId(output.id))
    expect(output).toStrictEqual({
      id: entity.castmember_id.id,
      name: "test",
      type: "Actor",
      created_at: entity.created_at,
    })

    output = await useCase.execute({
      name: "test",
      type: 1,
    })
    entity = await repository.findById(new CategoryId(output.id))
    expect(output).toStrictEqual({
      id: entity.castmember_id.id,
      name: "test",
      type: "Director",
      created_at: entity.created_at,
    })

    output = await useCase.execute({
      name: "test",
      type: 1,
    })
    entity = await repository.findById(new CategoryId(output.id))
    expect(output).toStrictEqual({
      id: entity.castmember_id.id,
      name: "test",
      type: "Director",
      created_at: entity.created_at,
    })
  })
})
