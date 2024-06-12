import { ValueObject } from "@core/shared/domain/value-object"

enum CastMemberTypeEnum {
  "director" = "1",
  "actor" = "2",
}

export class CastMemberType extends ValueObject {
  constructor(readonly type: string) {
    super()
    this.type = type
    this.validate()
  }

  private validate() {
    const isValid =
      this.type === CastMemberTypeEnum.director ||
      this.type === CastMemberTypeEnum.actor

    if (!isValid) {
      throw new InvalidCastMemberTypeError()
    }
  }

  static randomCastMemberType() {
    const types = [CastMemberTypeEnum.director, CastMemberTypeEnum.actor]
    const randomNumber = Math.random()
    const randomZeroOrOne = Math.round(randomNumber)
    return new CastMemberType(types[randomZeroOrOne])
  }

  toString() {
    return this.type
  }
}

export class InvalidCastMemberTypeError extends Error {
  constructor(message?: string) {
    super(message || "CastMemberType must be 'actor' or 'director'.")
    this.name = "InvalidCastMemberTypeError"
  }
}
