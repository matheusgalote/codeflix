import { UpdateCastMemberInput } from "@core/cast-member/application/use-cases/update-cast-member/update-category.input"
import { OmitType } from "@nestjs/mapped-types"

export class UpdateCastMemberDto extends OmitType(UpdateCastMemberInput, [
  "id",
] as const) {}
