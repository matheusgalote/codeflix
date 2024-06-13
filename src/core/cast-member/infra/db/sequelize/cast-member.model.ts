import {
  Column,
  Model,
  DataType,
  PrimaryKey,
  Table,
} from "sequelize-typescript"

export type CastMemberModelProps = {
  castmember_id: string
  name: string
  type: number
  created_at: Date
}

@Table({ tableName: "castmembers", timestamps: false })
export class CastMemberModel extends Model<CastMemberModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare castmember_id: string

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string

  @Column({ allowNull: false, type: DataType.SMALLINT })
  declare type: number

  @Column({ allowNull: false, type: DataType.DATE(3) })
  declare created_at: Date
}
