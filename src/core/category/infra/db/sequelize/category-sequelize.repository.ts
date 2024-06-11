import { Op, literal } from "sequelize"
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo"
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error"
import { Category } from "../../../domain/category.entity"
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from "../../../domain/category.repository"
import { CategoryModel } from "./category.model"
import { CategoryModelMapper } from "./category-model-mapper"
import { SortDirection } from "@core/shared/domain/repository/search-params"

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ["name", "created_at"]
  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`),
    },
  }

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity)
    await this.categoryModel.create(model.toJSON())
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON(),
    )
    await this.categoryModel.bulkCreate(models)
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id
    const model = await this._get(id)

    if (!model) {
      throw new NotFoundError(id, this.getEntity())
    }

    const modelToUpdate = CategoryModelMapper.toModel(entity)

    await this.categoryModel.update(modelToUpdate.toJSON(), {
      where: { category_id: id },
    })
  }

  async bulkUpdate(categories: Category[]): Promise<void> {
    const categoriesIds = categories.map((category) => category.category_id.id)
    const models = await this._getMany(categoriesIds)

    const modelsIds = models.map((model) => model.category_id)

    const notFoundIds = categoriesIds.filter(
      (categoryId) => !modelsIds.includes(categoryId),
    )

    if (notFoundIds.length) {
      throw new NotFoundError(notFoundIds, this.getEntity())
    }

    const modelsToUpdate = categories.map((category) =>
      CategoryModelMapper.toModel(category).toJSON(),
    )

    modelsToUpdate.map(async (model) => {
      await this.categoryModel.update(model, {
        where: {
          category_id: model.category_id,
        },
      })
    })

    // await this.categoryModel.bulkCreate(modelsToUpdate, {
    //   updateOnDuplicate: ["name", "description", "is_active"],
    // })
  }

  async delete(category_id: Uuid): Promise<void> {
    const id = category_id.id
    const affectedRows = await this.categoryModel.destroy({
      where: { category_id: id },
    })

    if (!affectedRows) {
      throw new NotFoundError(id, this.getEntity())
    }
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._get(entity_id.id)
    return model ? CategoryModelMapper.toEntity(model) : null
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id)
  }

  private async _getMany(ids: string[]) {
    return await this.categoryModel.findAll({
      where: {
        category_id: {
          [Op.in]: ids,
        },
      },
    })
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll()
    return models.map((model) => CategoryModelMapper.toEntity(model))
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page
    const limit = props.per_page

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: {
            [Op.like]: `%${props.filter}%`,
          },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? // ? { order: [[props.sort, props.sort_dir]] }
          { order: this.formatSort(props.sort, props.sort_dir) }
        : { order: [["created_at", "desc"]] }),
      offset,
      limit,
    })

    return new CategorySearchResult({
      items: models.map((model) => CategoryModelMapper.toEntity(model)),
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    })
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.categoryModel.sequelize.getDialect() as "mysql"

    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir)
    }
    return [[sort, sort_dir]]
  }

  getEntity(): new (...args: any[]) => Category {
    return Category
  }
}
