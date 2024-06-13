import { IUseCase } from "@core/shared/application/use-case.interface"
import { CreateCastMemberInput } from "./create-cast-member.input"
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "../common/cast-member-output"
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository"
import { CastMember } from "@core/cast-member/domain/cast-member.aggregate"
import { EntityValidationError } from "@core/shared/domain/validators/validation.error"
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"

export class CreateCastMemberUseCase
  implements IUseCase<CreateCastMemberInput, CreateCastMemberOutput>
{
  constructor(private readonly castMemberRepo: ICastMemberRepository) {}

  async execute(input: CreateCastMemberInput): Promise<CastMemberOutput> {
    const castMemberMapper = {
      ...input,
      type: new CastMemberType(input.type),
    }
    const castMember = CastMember.create(castMemberMapper)

    if (castMember.notification.hasErrors()) {
      throw new EntityValidationError(castMember.notification.toJSON())
    }

    await this.castMemberRepo.insert(castMember)

    return CastMemberOutputMapper.toOutput(castMember)
  }
}

export type CreateCastMemberOutput = CastMemberOutput
