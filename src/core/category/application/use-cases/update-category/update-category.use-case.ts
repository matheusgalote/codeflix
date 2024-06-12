import { IUseCase } from "../../../../shared/application/use-case.interface"
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error"
import { Category, CategoryId } from "../../../domain/category.aggregate"
import { ICategoryRepository } from "../../../domain/category.repository"
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output"
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error"

export class UpdateCategoryUseCase
  implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new CategoryId(input.id)
    const category = await this.categoryRepo.findById(uuid)

    // duplicado
    // essa verificação já é feita no update
    // nesse caso é necessário fazer isso pra utilizar os
    // métodos da entidade
    if (!category) {
      throw new NotFoundError(uuid, Category)
    }

    input.name && category.changeName(input.name)

    if (input.description !== undefined) {
      category.changeDescription(input.description)
    }

    if (input.is_active === true) {
      category.activate()
    }

    if (input.is_active === false) {
      category.deactivate()
    }

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON())
    }

    await this.categoryRepo.update(category)

    return CategoryOutputMapper.toOutput(category)
  }
}

export type UpdateCategoryInput = {
  id: string
  name?: string
  description?: string | null
  is_active?: boolean
}

export type UpdateCategoryOutput = CategoryOutput
