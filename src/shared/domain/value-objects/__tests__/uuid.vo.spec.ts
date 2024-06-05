import { InvalidUuidError, Uuid } from "../uuid.vo"
import { validate as uuidValidate } from "uuid"

describe("Uuid Unit Tests", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate")

  test("should throw error when uuid is invalid", () => {
    expect(() => {
      new Uuid("invalid uuid")
    }).toThrow(new InvalidUuidError())
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test("should create a valid uuid", () => {
    const uuid = new Uuid()
    expect(uuid.id).toBeDefined()
    expect(uuidValidate(uuid.id)).toBeTruthy()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test("should accept a valid uuid", () => {
    const uuid = new Uuid("b729f431-5f78-45f9-85c1-9f834d4834a9")
    expect(uuid.id).toEqual("b729f431-5f78-45f9-85c1-9f834d4834a9")
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})
