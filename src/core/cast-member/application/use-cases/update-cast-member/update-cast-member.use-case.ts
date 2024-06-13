import { IUseCase } from "@core/shared/application/use-case.interface"
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "../common/cast-member-output"
import {
  CastMember,
  CastMemberId,
} from "@core/cast-member/domain/cast-member.aggregate"
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository"
import { NotFoundError } from "@core/shared/domain/errors/not-found.error"
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"
import { EntityValidationError } from "@core/shared/domain/validators/validation.error"

export class UpdateCastMemberUseCase
  implements IUseCase<UpdateCastMemberInput, UpdateCastMemberOutput>
{
  constructor(private readonly castMemberRepository: ICastMemberRepository) {}

  async execute(input: UpdateCastMemberInput): Promise<CastMemberOutput> {
    const uuid = new CastMemberId(input.id)
    const castMember = await this.castMemberRepository.findById(uuid)

    if (!castMember) {
      throw new NotFoundError(uuid, CastMember)
    }

    input.name && castMember.changeName(input.name)

    if (input.type) {
      castMember.changeCastMemberType(new CastMemberType(input.type))
    }

    if (castMember.notification.hasErrors()) {
      throw new EntityValidationError(castMember.notification.toJSON())
    }

    await this.castMemberRepository.update(castMember)

    return CastMemberOutputMapper.toOutput(castMember)
  }
}

export type UpdateCastMemberInput = {
  id: string
  name?: string
  type?: number
}

export type UpdateCastMemberOutput = CastMemberOutput
