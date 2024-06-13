import { Uuid } from "@core/shared/domain/value-objects/uuid.vo"
import { CastMemberType } from "./cast-member-type.vo"
import { ValueObject } from "@core/shared/domain/value-object"
import { CastMemberValidatorFactory } from "./cast-member.validator"
import { AggregateRoot } from "@core/shared/domain/aggregate-root"
import { CastMemberFakeBuilder } from "./cast-member-fake.builder"

export type CastMemberConstructorProps = {
  castmember_id?: CastMemberId
  name: string
  type: CastMemberType
  created_at?: Date
}

export type CastMemberCreateCommand = {
  name: string
  type: CastMemberType
  created_at?: Date
}

export class CastMemberId extends Uuid {}

export class CastMember extends AggregateRoot {
  castmember_id: CastMemberId
  name: string
  type: CastMemberType
  created_at: Date

  constructor(props: CastMemberConstructorProps) {
    super()
    this.castmember_id = props.castmember_id ?? new CastMemberId()
    this.name = props.name
    this.type = props.type
    this.created_at = props.created_at ?? new Date()
  }

  static create(props: CastMemberCreateCommand) {
    const castMember = new CastMember(props)
    castMember.validate(["name"])
    return castMember
  }

  changeName(name: string) {
    this.name = name
    this.validate(["name"])
  }

  changeCastMemberType(type: CastMemberType) {
    this.type = type
  }

  get entity_id(): ValueObject {
    return this.castmember_id
  }

  validate(fields?: string[]) {
    const validator = CastMemberValidatorFactory.create()
    return validator.validate(this.notification, this, fields)
  }

  static fake() {
    return CastMemberFakeBuilder
  }

  toJSON() {
    return {
      castmember_id: this.castmember_id.id,
      name: this.name,
      type: this.type.type,
      created_at: this.created_at,
    }
  }
}
