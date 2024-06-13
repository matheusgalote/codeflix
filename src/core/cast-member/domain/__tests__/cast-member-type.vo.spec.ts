import {
  CastMemberType,
  InvalidCastMemberTypeError,
} from "../cast-member-type.vo"

describe("CastMemberType Unit Tests", () => {
  const validateSpy = jest.spyOn(CastMemberType.prototype as any, "validate")

  test("should throw a error when pass the invalid type", () => {
    expect(() => new CastMemberType(3)).toThrow(
      new InvalidCastMemberTypeError(),
    )
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test("should create a cast member type", () => {
    const castMemberType = new CastMemberType(1)
    expect(castMemberType).toBeInstanceOf(CastMemberType)
    expect(castMemberType.type).toBe("1")
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test("should create a random cast member type", () => {
    const castMemberType = CastMemberType.randomCastMemberType()
    expect(castMemberType).toBeInstanceOf(CastMemberType)
    expect(castMemberType.type).toBeTruthy()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})
