import { ListCastMemberUseCase } from "../list-cast-member.use-case"
import { CastMember } from "@core/cast-member/domain/cast-member.aggregate"
import { CastMemberOutputMapper } from "../../common/cast-member-output"
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"
import { CastMemberSequelizeRepository } from "@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository"
import { CastMemberModel } from "@core/cast-member/infra/db/sequelize/cast-member.model"
import { setupSequelize } from "@core/shared/infra/testing/helpers"

describe("ListCastMemberUseCase Unit Tests", () => {
  let useCase: ListCastMemberUseCase
  let repository: CastMemberSequelizeRepository

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel)
    useCase = new ListCastMemberUseCase(repository)
  })

  setupSequelize({ models: [CastMemberModel] })

  test("should return output sorted by created_at when input param is empty", async () => {
    const castMembers = CastMember.fake()
      .theCastMembers(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build()

    await repository.bulkInsert(castMembers)

    const output = await useCase.execute({})

    expect(output).toEqual({
      items: [...castMembers].reverse().map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    })
  })

  test("should return output using pagination, sort and filter", async () => {
    const items = [
      new CastMember({
        name: "a",
        type: CastMemberType.randomCastMemberType(),
      }),
      new CastMember({
        name: "AAA",
        type: CastMemberType.randomCastMemberType(),
      }),
      new CastMember({
        name: "AaA",
        type: CastMemberType.randomCastMemberType(),
      }),
      new CastMember({
        name: "b",
        type: CastMemberType.randomCastMemberType(),
      }),
      new CastMember({
        name: "c",
        type: CastMemberType.randomCastMemberType(),
      }),
    ]
    await repository.bulkInsert(items)

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: {
        name: "a",
      },
    })
    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: {
        name: "a",
      },
    })
    expect(output).toStrictEqual({
      items: [items[0]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    })

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: {
        name: "a",
      },
    })
    expect(output).toStrictEqual({
      items: [items[0], items[2]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })
  })
})
