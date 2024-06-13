import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"
import { CastMember } from "@core/cast-member/domain/cast-member.aggregate"

export type CastMemberOutput = {
  id: string
  name: string
  type: string
  created_at: Date
}

export class CastMemberOutputMapper {
  static toOutput(entity: CastMember): CastMemberOutput {
    const { castmember_id, name, type, created_at } = entity.toJSON()

    return {
      id: castmember_id,
      name,
      type: CastMemberType.toOutput(type),
      created_at,
    }
  }
}
