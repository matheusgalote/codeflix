import { IUseCase } from "../../../shared/application/use-case.interface"
import { Category } from "../../domain/category.entity"
import { ICategoryRepository } from "../../domain/category.repository"
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output"

export class CreateCategoryUseCase
  implements IUseCase<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const entity = Category.create(input)

    await this.categoryRepo.insert(entity)

    // ao fazer uma mudança na entidade, não vai impactar aqui
    // caso retorno direto a entidade, quem usar esse caso de uso
    // vai conhecer detalhes externos (da entidade)
    // return {
    //   id: entity.category_id.id,
    //   name: entity.name,
    //   description: entity.description,
    //   is_active: entity.is_active,
    //   created_at: entity.created_at,
    // }
    return CategoryOutputMapper.toOutput(entity)
  }
}

export type CreateCategoryInput = {
  name: string
  description?: string | null
  is_active?: boolean
}

export type CreateCategoryOutput = CategoryOutput