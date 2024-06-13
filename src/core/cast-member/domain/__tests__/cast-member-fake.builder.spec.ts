import { Chance } from "chance"
import { CastMemberFakeBuilder } from "../cast-member-fake.builder"
import { CastMemberId } from "../cast-member.aggregate"
import { CastMemberType } from "../cast-member-type.vo"

describe("CategoryFakerBuilder Unit Tests", () => {
  describe("castmember_id props", () => {
    const faker = CastMemberFakeBuilder.aCastMember()
    test("should throw error when any with methods has called", () => {
      expect(() => faker.castmember_id).toThrow(
        new Error(
          "Property castmember_id not have a factory, use 'with' methods",
        ),
      )
    })

    test("should be undefined", () => {
      expect(faker["_castmember_id"]).toBeUndefined()
    })

    test("withUuid", () => {
      const castmember_id = new CastMemberId()
      const $this = faker.withUuid(castmember_id)
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker["_castmember_id"]).toBe(castmember_id)

      faker.withUuid(() => castmember_id)
      //@ts-expect-error _castmember_id is a callable
      expect(faker["_castmember_id"]()).toBe(castmember_id)

      expect(faker.castmember_id).toBe(castmember_id)
    })

    test("should pass index to castmember_id factory", () => {
      let mockFactory = jest.fn(() => new CastMemberId())
      faker.withUuid(mockFactory)
      faker.build()
      expect(mockFactory).toHaveBeenCalledTimes(1)

      const castMemberId = new CastMemberId()
      mockFactory = jest.fn(() => castMemberId)
      const fakerMany = CastMemberFakeBuilder.theCastMembers(2)
      fakerMany.withUuid(mockFactory)
      fakerMany.build()

      expect(mockFactory).toHaveBeenCalledTimes(2)
      expect(fakerMany.build()[0].castmember_id).toBe(castMemberId)
      expect(fakerMany.build()[1].castmember_id).toBe(castMemberId)
    })
  })

  describe("name prop", () => {
    const faker = CastMemberFakeBuilder.aCastMember()
    test("should be a function", () => {
      expect(typeof faker["_name"]).toBe("function")
    })

    test("should call the word method", () => {
      const chance = Chance()
      const spyWordMethod = jest.spyOn(chance, "word")
      faker["chance"] = chance
      faker.build()

      expect(spyWordMethod).toHaveBeenCalled()
    })

    test("withName", () => {
      const $this = faker.withName("test name")
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker["_name"]).toBe("test name")

      faker.withName(() => "test name")
      //@ts-expect-error name is callable
      expect(faker["_name"]()).toBe("test name")

      expect(faker.name).toBe("test name")
    })

    test("should pass index to name factory", () => {
      faker.withName((index) => `test name ${index}`)
      const category = faker.build()
      expect(category.name).toBe(`test name 0`)

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2)
      fakerMany.withName((index) => `test name ${index}`)
      const categories = fakerMany.build()

      expect(categories[0].name).toBe(`test name 0`)
      expect(categories[1].name).toBe(`test name 1`)
    })

    test("invalid too long case", () => {
      const $this = faker.withInvalidNameTooLong()
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker["_name"].length).toBe(256)

      const tooLong = "a".repeat(256)
      faker.withInvalidNameTooLong(tooLong)
      expect(faker["_name"].length).toBe(256)
      expect(faker["_name"]).toBe(tooLong)
    })
  })

  describe("type prop", () => {
    const faker = CastMemberFakeBuilder.aCastMember()
    test("should be undefined", () => {
      expect(typeof faker["_type"]).toBe("undefined")
    })

    test("withType", () => {
      let castMemberType = new CastMemberType(1)
      const $this = faker.withType(castMemberType)
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker["_type"]).toBe(castMemberType)

      castMemberType = new CastMemberType(2)
      faker.withType(() => castMemberType)
      //@ts-expect-error type is callable
      expect(faker["_type"]()).toBe(castMemberType)

      expect(faker.type).toBe(castMemberType)
    })

    test("should pass cast member type to type factory", () => {
      let mockFactory = jest.fn(() => new CastMemberType(1))
      faker.withType(mockFactory)
      faker.build()
      expect(mockFactory).toHaveBeenCalledTimes(1)

      const castMemberType = new CastMemberType(2)
      mockFactory = jest.fn(() => castMemberType)
      const fakerMany = CastMemberFakeBuilder.theCastMembers(2)
      fakerMany.withType(mockFactory)
      fakerMany.build()

      expect(mockFactory).toHaveBeenCalledTimes(2)
      expect(fakerMany.build()[0].type).toBe(castMemberType)
      expect(fakerMany.build()[1].type).toBe(castMemberType)
    })
  })

  describe("created_at prop", () => {
    const faker = CastMemberFakeBuilder.aCastMember()

    test("should throw error when any with methods has called", () => {
      const fakerCategory = CastMemberFakeBuilder.aCastMember()
      expect(() => fakerCategory.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods"),
      )
    })

    test("should be undefined", () => {
      expect(faker["_created_at"]).toBeUndefined()
    })

    test("withCreatedAt", () => {
      const date = new Date()
      const $this = faker.withCreatedAt(date)
      expect($this).toBeInstanceOf(CastMemberFakeBuilder)
      expect(faker["_created_at"]).toBe(date)

      faker.withCreatedAt(() => date)
      //@ts-expect-error _created_at is a callable
      expect(faker["_created_at"]()).toBe(date)
      expect(faker.created_at).toBe(date)
    })

    test("should pass index to created_at factory", () => {
      const date = new Date()
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const category = faker.build()
      expect(category.created_at.getTime()).toBe(date.getTime() + 2)

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2)
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const categories = fakerMany.build()

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2)
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 3)
    })
  })

  test("should create a cast member", () => {
    const faker = CastMemberFakeBuilder.aCastMember()
    let castMember = faker.build()

    expect(castMember.castmember_id).toBeInstanceOf(CastMemberId)
    expect(typeof castMember.name === "string").toBeTruthy()
    expect(castMember.type).toBeInstanceOf(CastMemberType)
    expect(castMember.created_at).toBeInstanceOf(Date)

    const created_at = new Date()
    const category_id = new CastMemberId()
    const type = new CastMemberType(2)

    castMember = faker
      .withUuid(category_id)
      .withName("name test")
      .withType(type)
      .withCreatedAt(created_at)
      .build()

    expect(castMember.castmember_id.id).toBe(category_id.id)
    expect(castMember.name).toBe("name test")
    expect(castMember.type.type).toBe(type.type)
    expect(castMember.created_at).toBe(created_at)
  })

  test("should create many cast members", () => {
    const faker = CastMemberFakeBuilder.theCastMembers(2)
    let castMembers = faker.build()

    castMembers.forEach((category) => {
      expect(category.castmember_id).toBeInstanceOf(CastMemberId)
      expect(typeof category.name === "string").toBeTruthy()
      expect(category.type).toBeInstanceOf(CastMemberType)
      expect(category.created_at).toBeInstanceOf(Date)
    })

    const created_at = new Date()
    const castmember_id = new CastMemberId()
    const type = new CastMemberType(2)
    castMembers = faker
      .withUuid(castmember_id)
      .withName("name test")
      .withType(type)
      .build()

    console.log(created_at)
    castMembers.forEach((castMember) => {
      expect(castMember.castmember_id.id).toBe(castmember_id.id)
      expect(castMember.name).toBe("name test")
      expect(castMember.type.type).toBe(type.type)
      expect(castMember.created_at).toBeInstanceOf(Date)
    })
  })
})
