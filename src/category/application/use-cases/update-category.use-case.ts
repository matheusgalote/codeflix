import { IUseCase } from "../../../shared/application/use-case.interface"
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo"
import { NotFoundError } from "../../../shared/domain/errors/not-found.error"
import { Category } from "../../domain/category.entity"
import { ICategoryRepository } from "../../domain/category.repository"
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output"

export class UpdateCategoryUseCase
  implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.id)
    const category = await this.categoryRepo.findById(uuid)

    // duplicado
    // essa verificação já é feita no update
    // nesse caso é necessário fazer isso pra utilizar os
    // métodos da entidade
    if (!category) {
      throw new NotFoundError(uuid, Category)
    }

    input.name && category.changeName(input.name)

    if ("description" in input) {
      category.changeDescription(input.description)
    }

    if (input.is_active === true) {
      category.activate()
    }

    if (input.is_active === false) {
      category.deactivate()
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