import {
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from "@core/cast-member/domain/cast-member.repository"
import { SortDirection } from "@core/shared/domain/repository/search-params"
import { literal, Op } from "sequelize"
import { CastMemberModel } from "./cast-member.model"
import {
  CastMember,
  CastMemberId,
} from "@core/cast-member/domain/cast-member.aggregate"
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"
import { EntityValidationError } from "@core/shared/domain/validators/validation.error"
import { NotFoundError } from "@core/shared/domain/errors/not-found.error"

export class CastMemberSequelizeRepository implements ICastMemberRepository {
  sortableFields: string[] = ["name", "type", "created_at"]

  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binart name ${sort_dir}`),
    },
  }

  constructor(private castMemberModel: typeof CastMemberModel) {}

  async insert(entity: CastMember): Promise<void> {
    const model = CastMemberModelMapper.toModel(entity)
    await this.castMemberModel.create(model.toJSON())
  }

  async update(entity: CastMember): Promise<void> {
    const id = entity.castmember_id.id

    const modelToUpdate = CastMemberModelMapper.toModel(entity)
    const [affectedRows] = await this.castMemberModel.update(
      modelToUpdate.toJSON(),
      {
        where: { castmember_id: id },
      },
    )

    if (!affectedRows) {
      throw new NotFoundError(id, this.getEntity())
    }
  }

  async delete(castmember_id: CastMemberId): Promise<void> {
    const id = castmember_id.id
    const affectedRows = await this.castMemberModel.destroy({
      where: {
        castmember_id: id,
      },
    })

    if (!affectedRows) {
      throw new NotFoundError(id, this.getEntity())
    }
  }

  async findById(entity_id: CastMemberId): Promise<CastMember> {
    const model = await this._get(entity_id.id)
    return model ? CastMemberModelMapper.toEntity(model) : null
  }

  async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
    const offset = (props.page - 1) * props.per_page
    const limit = props.per_page

    const where = {}

    if (props.filter?.name) {
      where["name"] = {
        [Op.like]: `%${props.filter.name}%`,
      }
    }

    if (props.filter?.type) {
      where["type"] = props.filter.type
    }

    const { rows: models, count } = await this.castMemberModel.findAndCountAll({
      where,
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: this.formatSort(props.sort, props.sort_dir) }
        : { order: [["created_at", "desc"]] }),
      offset,
      limit,
    })

    return new CastMemberSearchResult({
      items: models.map((model) => CastMemberModelMapper.toEntity(model)),
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    })
  }

  async findAll(): Promise<CastMember[]> {
    const models = await this.castMemberModel.findAll()
    return models.map((model) => CastMemberModelMapper.toEntity(model))
  }

  async bulkInsert(entities: CastMember[]): Promise<void> {
    const models = entities.map((entity) =>
      CastMemberModelMapper.toModel(entity).toJSON(),
    )
    await this.castMemberModel.bulkCreate(models)
  }

  bulkUpdate(entites: CastMember[]): Promise<void> {
    entites
    return
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.castMemberModel.sequelize.getDialect() as "mysql"

    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir)
    }
    return [[sort, sort_dir]]
  }

  private async _get(id: string) {
    return await this.castMemberModel.findByPk(id)
  }
}

export class CastMemberModelMapper {
  static toModel(entity: CastMember): CastMemberModel {
    return CastMemberModel.build({
      castmember_id: entity.castmember_id.id,
      name: entity.name,
      type: entity.type.type,
      created_at: entity.created_at,
    })
  }

  static toEntity(model: CastMemberModel): CastMember {
    const castMember = new CastMember({
      castmember_id: new CastMemberId(model.castmember_id),
      name: model.name,
      type: new CastMemberType(model.type),
      created_at: model.created_at,
    })
    castMember.validate()
    if (castMember.notification.hasErrors()) {
      throw new EntityValidationError(castMember.notification.toJSON())
    }
    return castMember
  }
}
