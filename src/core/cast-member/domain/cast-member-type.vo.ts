import { Either } from "@core/shared/domain/either"
import { ValueObject } from "@core/shared/domain/value-object"

export enum CastMemberTypes {
  DIRECTOR = 1,
  ACTOR = 2,
}

const mapper = {
  1: {
    name: "Director",
  },
  2: {
    name: "Actor",
  },
}

export class CastMemberType extends ValueObject {
  constructor(readonly type: number) {
    super()
    this.type = type
    this.validate()
  }

  private validate() {
    const isValid =
      this.type === CastMemberTypes.DIRECTOR ||
      this.type === CastMemberTypes.ACTOR

    if (!isValid) {
      throw new InvalidCastMemberTypeError()
    }
  }

  static randomCastMemberType() {
    const types = [CastMemberTypes.DIRECTOR, CastMemberTypes.ACTOR]
    const randomNumber = Math.random()
    const randomZeroOrOne = Math.round(randomNumber)
    return new CastMemberType(types[randomZeroOrOne])
  }

  static create(
    value: CastMemberTypes,
  ): Either<CastMemberType, InvalidCastMemberTypeError> {
    return Either.safe(() => new CastMemberType(value))
  }

  static createAnActor() {
    return CastMemberType.create(CastMemberTypes.ACTOR).ok
  }

  static createADirector() {
    return CastMemberType.create(CastMemberTypes.DIRECTOR).ok
  }

  static toOutput(type: number) {
    return mapper[type]["name"]
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
