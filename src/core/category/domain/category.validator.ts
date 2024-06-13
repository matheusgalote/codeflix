import { MaxLength } from "class-validator"
import { Category } from "./category.aggregate"
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields"
import { Notification } from "../../shared/domain/validators/notification"

// validação de sintax vs validação de domnio
// ex:
// formatar uma data é uma validação de sintax
// verificar se a data é menor que a data atual de domínio

// Isso está acoplado ao class-validator
// Necessário mudar caso troque de lib
export class CategoryRules {
  @MaxLength(255, { groups: ["name"] })
  name: string

  description: string | null

  is_active: boolean

  constructor(aggregate: Category) {
    Object.assign(this, aggregate)
  }
}

class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(notification: Notification, data: any, fields?: string[]) {
    const newFields = fields?.length ? fields : ["name"]
    return super.validate(notification, new CategoryRules(data), newFields)
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator()
  }
}
