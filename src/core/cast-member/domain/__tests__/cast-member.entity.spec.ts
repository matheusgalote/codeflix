import { Uuid } from "@core/shared/domain/value-objects/uuid.vo"
import { CastMemberType } from "../cast-member-type.vo"
import { CastMember } from "../cast-member.aggregate"

describe("CastMember Unit Tests", () => {
  beforeEach(() => {
    CastMember.prototype.validate = jest
      .fn()
      .mockImplementation(CastMember.prototype.validate)
  })

  test("constructor of cast member", () => {
    let castMember = new CastMember({
      name: "Joe",
      type: new CastMemberType(1),
    })

    expect(castMember.castmember_id).toBeInstanceOf(Uuid)
    expect(castMember.name).toBe("Joe")
    expect(castMember.type.type).toBe(1)
    expect(castMember.created_at).toBeInstanceOf(Date)

    const created_at = new Date()

    castMember = new CastMember({
      name: "Joe Doe",
      type: new CastMemberType(2),
      created_at,
    })

    expect(castMember.castmember_id).toBeInstanceOf(Uuid)
    expect(castMember.name).toBe("Joe Doe")
    expect(castMember.type).toStrictEqual(new CastMemberType(2))
    expect(castMember.created_at).toEqual(created_at)
  })

  describe("create command", () => {
    test("should create a cast member", () => {
      const castMember = CastMember.create({
        name: "Joe",
        type: new CastMemberType(1),
      })

      expect(castMember.castmember_id).toBeInstanceOf(Uuid)
      expect(castMember.name).toBe("Joe")
      expect(castMember.type).toBeInstanceOf(CastMemberType)
      expect(castMember.type.type).toBe(1)
      expect(castMember.type).toStrictEqual(new CastMemberType(1))
      expect(castMember.created_at).toBeInstanceOf(Date)
    })
  })

  describe("castmember_id field", () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new Uuid() }]

    test.each(arrange)("should be is %j", (props) => {
      const castMember = new CastMember(props as any)
      expect(castMember.castmember_id).toBeInstanceOf(Uuid)
    })
  })

  test("should change name", () => {
    const castMember = new CastMember({
      name: "Joe",
      type: new CastMemberType(2),
    })

    castMember.changeName("Joe Doe")
    expect(castMember.name).toBe("Joe Doe")
    expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1)
    expect(castMember.notification.hasErrors()).toBe(false)
  })

  test("should change CastMemberType", () => {
    const castMember = new CastMember({
      name: "Joe",
      type: new CastMemberType(2),
    })

    castMember.changeCastMemberType(new CastMemberType(1))
    expect(castMember.type).toStrictEqual(new CastMemberType(1))
    expect(CastMember.prototype.validate).toHaveBeenCalledTimes(0)
    expect(castMember.notification.hasErrors()).toBe(false)
  })
})

describe("CastMember Validator", () => {
  describe("create command", () => {
    test("should an invalid category with name property", () => {
      const category = CastMember.create({
        name: "t".repeat(256),
        type: new CastMemberType(1),
      })

      expect(category.notification.hasErrors()).toBe(true)
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ])
    })
  })

  describe("changeName method", () => {
    test("should a invalid category using name property", () => {
      const category = CastMember.create({
        name: "Movie",
        type: new CastMemberType(1),
      })
      category.changeName("t".repeat(256))
      expect(category.notification.hasErrors()).toBe(true)
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      ])
    })
  })
})
