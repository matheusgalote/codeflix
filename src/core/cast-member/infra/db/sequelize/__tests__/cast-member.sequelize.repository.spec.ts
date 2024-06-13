import {
  CastMember,
  CastMemberId,
} from "@core/cast-member/domain/cast-member.aggregate"
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import { setupSequelize } from "../../../../../shared/infra/testing/helpers"

import {
  CastMemberModelMapper,
  CastMemberSequelizeRepository,
} from "../cast-member-sequelize.repository"
import { CastMemberModel } from "../cast-member.model"
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
} from "@core/cast-member/domain/cast-member.repository"
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"

describe("CategorySequelizeRepository Integration Test", () => {
  setupSequelize({ models: [CastMemberModel] })

  let repository: CastMemberSequelizeRepository

  beforeEach(async () => {
    repository = new CastMemberSequelizeRepository(CastMemberModel)
  })

  test("should insert a new cast member", async () => {
    const castMember = CastMember.fake().aCastMember().build()
    await repository.insert(castMember)

    const model = await CastMemberModel.findByPk(castMember.castmember_id.id)
    expect(model.toJSON()).toMatchObject(<CastMemberModel>{
      castmember_id: castMember.castmember_id.id,
      name: castMember.name,
      type: castMember.type.type,
      created_at: castMember.created_at,
    })
  })

  test("should finds a entity by id", async () => {
    let entityFound = await repository.findById(new CastMemberId())
    expect(entityFound).toBeNull()

    const entity = CastMember.fake().aCastMember().build()
    await repository.insert(entity)
    entityFound = await repository.findById(entity.castmember_id)
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON())
  })

  test("should return all cast members", async () => {
    const entity = CastMember.fake().aCastMember().build()
    await repository.insert(entity)
    const entities = await repository.findAll()
    expect(entities).toHaveLength(1)
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
  })

  test("should throw error on update when a entity not found", async () => {
    const entity = CastMember.fake().aCastMember().build()
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.castmember_id.id, CastMember),
    )
  })

  test("should update a entity", async () => {
    const entity = CastMember.fake().aCastMember().build()
    await repository.insert(entity)

    entity.changeName("Joe Doe")
    await repository.update(entity)

    const entityFound = await repository.findById(entity.castmember_id)
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON())
  })

  test("should throw error on delete when a entity not found", async () => {
    const categoryId = new CastMemberId()
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, CastMember),
    )
  })

  test("should delete a entity", async () => {
    const entity = new CastMember({
      name: "Movie",
      type: new CastMemberType(1),
    })
    await repository.insert(entity)

    await repository.delete(entity.castmember_id)
    await expect(repository.findById(entity.castmember_id)).resolves.toBeNull()
  })

  describe("search method tests", () => {
    test("should only apply paginate when other params are null", async () => {
      const created_at = new Date()
      const castMembers = CastMember.fake()
        .theCastMembers(16)
        .withName("Joe")
        .withType(new CastMemberType(1))
        .withCreatedAt(created_at)
        .build()
      await repository.bulkInsert(castMembers)
      const spyToEntity = jest.spyOn(CastMemberModelMapper, "toEntity")

      const searchOutput = await repository.search(
        CastMemberSearchParams.create(),
      )
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(15)
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      })
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(CastMember)
        expect(item.castmember_id).toBeDefined()
      })
      const items = searchOutput.items.map((item) => item.toJSON())
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Joe",
          type: 1,
          created_at: created_at,
        }),
      )
    })

    test("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date()
      const castMembers = CastMember.fake()
        .theCastMembers(16)
        .withName((index) => `Joe ${index}`)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build()
      const searchOutput = await repository.search(
        CastMemberSearchParams.create(),
      )
      const items = searchOutput.items
      ;[...items].reverse().forEach((item, index) => {
        expect(`Joe ${index}`).toBe(`${castMembers[index + 1].name}`)
      })
    })

    test("should apply paginate and filter", async () => {
      const castMembers = [
        CastMember.fake()
          .aCastMember()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ]

      await repository.bulkInsert(castMembers)

      let searchOutput = await repository.search(
        CastMemberSearchParams.create({
          per_page: 2,
          page: 1,
          filter: {
            name: "TEST",
          },
        }),
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[0], castMembers[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      )

      searchOutput = await repository.search(
        CastMemberSearchParams.create({
          page: 2,
          per_page: 2,
          filter: {
            name: "TEST",
          },
        }),
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true),
      )
    })

    test("should apply paginate and filter to type", async () => {
      const castMembers = [
        CastMember.fake()
          .aCastMember()
          .withName("test")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("a")
          .withType(new CastMemberType(1))
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TEST")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TeSt")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ]

      await repository.bulkInsert(castMembers)

      let searchOutput = await repository.search(
        CastMemberSearchParams.create({
          per_page: 2,
          page: 1,
          filter: {
            type: 2,
          },
        }),
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[0], castMembers[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      )

      searchOutput = await repository.search(
        CastMemberSearchParams.create({
          page: 2,
          per_page: 2,
          filter: {
            type: 2,
          },
        }),
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true),
      )

      searchOutput = await repository.search(
        CastMemberSearchParams.create({
          page: 1,
          per_page: 2,
          filter: {
            type: 1,
          },
        }),
      )

      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[1]],
          total: 1,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      )
    })

    test("should apply paginate and filter to type and name", async () => {
      const castMembers = [
        CastMember.fake()
          .aCastMember()
          .withName("Joe")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("Joe")
          .withType(new CastMemberType(1))
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("JoE")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TeSt")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ]

      await repository.bulkInsert(castMembers)

      let searchOutput = await repository.search(
        CastMemberSearchParams.create({
          per_page: 2,
          page: 1,
          filter: {
            name: "Joe",
            type: 2,
          },
        }),
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[0], castMembers[2]],
          total: 2,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      )

      searchOutput = await repository.search(
        CastMemberSearchParams.create({
          page: 1,
          per_page: 2,
          filter: {
            type: 1,
          },
        }),
      )

      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[1]],
          total: 1,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      )
    })

    test("should apply paginate and filter to type and name and sort by name", async () => {
      const castMembers = [
        CastMember.fake()
          .aCastMember()
          .withName("Joe")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("Joe")
          .withType(new CastMemberType(1))
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("JoE")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TeSt")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ]

      await repository.bulkInsert(castMembers)

      const searchOutput = await repository.search(
        CastMemberSearchParams.create({
          per_page: 2,
          page: 1,
          filter: {
            name: "Joe",
            type: 2,
          },
          sort: "name",
        }),
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[2], castMembers[0]],
          total: 2,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      )
    })

    test("should apply paginate filter by name and sort by type", async () => {
      const castMembers = [
        CastMember.fake()
          .aCastMember()
          .withName("Joe")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("Joe")
          .withType(new CastMemberType(1))
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("JoE")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName("TeSt")
          .withType(new CastMemberType(2))
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ]

      await repository.bulkInsert(castMembers)

      let searchOutput = await repository.search(
        CastMemberSearchParams.create({
          per_page: 2,
          page: 1,
          filter: {
            name: "Joe",
          },
          sort: "type",
        }),
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[1], castMembers[0]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      )

      searchOutput = await repository.search(
        CastMemberSearchParams.create({
          page: 2,
          per_page: 2,
          filter: {
            name: "Joe",
          },
          sort: "type",
        }),
      )

      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[2]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true),
      )
    })

    test("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual([
        "name",
        "type",
        "created_at",
      ])

      const categories = [
        CastMember.fake().aCastMember().withName("b").build(),
        CastMember.fake().aCastMember().withName("a").build(),
        CastMember.fake().aCastMember().withName("d").build(),
        CastMember.fake().aCastMember().withName("e").build(),
        CastMember.fake().aCastMember().withName("c").build(),
      ]
      await repository.bulkInsert(categories)

      const arrange = [
        {
          params: CastMemberSearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new CastMemberSearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: CastMemberSearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CastMemberSearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: CastMemberSearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CastMemberSearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: CastMemberSearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CastMemberSearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ]

      for (const i of arrange) {
        const result = await repository.search(i.params)
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true))
      }
    })

    describe("should search using filter, sort and paginate", () => {
      const categories = [
        CastMember.fake().aCastMember().withName("test").build(),
        CastMember.fake().aCastMember().withName("a").build(),
        CastMember.fake().aCastMember().withName("TEST").build(),
        CastMember.fake().aCastMember().withName("e").build(),
        CastMember.fake().aCastMember().withName("TeSt").build(),
      ]

      const arrange = [
        {
          search_params: CastMemberSearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: {
              name: "TEST",
            },
          }),
          search_result: new CastMemberSearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: CastMemberSearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: {
              name: "TEST",
            },
          }),
          search_result: new CastMemberSearchResult({
            items: [categories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ]

      beforeEach(async () => {
        await repository.bulkInsert(categories)
      })

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params)
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true))
        },
      )
    })
  })
})
