import { Uuid } from "@core/shared/domain/value-objects/uuid.vo"
import { CastMemberType } from "./cast-member-type.vo"
import { Entity } from "@core/shared/domain/entity"
import { ValueObject } from "@core/shared/domain/value-object"
import { CastMemberValidatorFactory } from "./cast-member.validator"

export type CastMemberConstructorProps = {
  castmember_id?: Uuid
  name: string
  castmember_type: CastMemberType
  created_at?: Date
}

export type CastMemberCreateCommand = {
  name: string
  castmember_type: CastMemberType
  created_at?: Date
}

export class CastMember extends Entity {
  castmember_id: Uuid
  name: string
  castmember_type: CastMemberType
  created_at: Date

  constructor(props: CastMemberConstructorProps) {
    super()
    this.castmember_id = props.castmember_id ?? new Uuid()
    this.name = props.name
    this.castmember_type = props.castmember_type
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
    this.castmember_type = type
  }

  get entity_id(): ValueObject {
    return this.castmember_id
  }

  validate(fields?: string[]) {
    const validator = CastMemberValidatorFactory.create()
    return validator.validate(this.notification, this, fields)
  }

  toJSON() {
    return {
      castmember_id: this.castmember_id,
      name: this.name,
      castmember_type: this.castmember_type.type,
      created_at: this.created_at,
    }
  }
}
