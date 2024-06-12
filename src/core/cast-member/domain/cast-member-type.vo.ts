import { ValueObject } from "@core/shared/domain/value-object"

enum CastMemberTypeEnum {
  "director" = "1",
  "actor" = "2",
}

export class CastMemberType extends ValueObject {
  readonly type: string

  constructor(type: string) {
    super()
    this.type = CastMemberTypeEnum[type]
    this.validate()
  }

  private validate() {
    const isValid = this.type === "1" || this.type === "2"

    if (!isValid) {
      throw new InvalidCastMemberTypeError()
    }
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
