import { ValueObject } from "@core/shared/domain/value-object"

export class CastMemberType extends ValueObject {
  readonly type: "actor" | "director"

  constructor(type?: "actor" | "director") {
    super()
    this.type = type
    this.validate()
  }

  private validate() {
    const isValid = this.type === "actor" || this.type === "director"
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
