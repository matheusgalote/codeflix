import { MaxLength } from "class-validator"
import { CastMember } from "./cast-member.aggregate"
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields"
import { Notification } from "../../shared/domain/validators/notification"

export class CastMemberRules {
  @MaxLength(255, { groups: ["name"] })
  name: string

  type: number

  created_at: Date

  constructor(aggregate: CastMember) {
    Object.assign(this, aggregate)
  }
}

class CastMemberValidator extends ClassValidatorFields<CastMemberRules> {
  validate(notification: Notification, data: any, fields?: string[]) {
    const newFields = fields?.length ? fields : ["name"]
    return super.validate(notification, new CastMemberRules(data), newFields)
  }
}

export class CastMemberValidatorFactory {
  static create() {
    return new CastMemberValidator()
  }
}
