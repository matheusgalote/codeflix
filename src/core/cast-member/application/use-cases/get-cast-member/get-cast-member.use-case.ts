import { IUseCase } from "@core/shared/application/use-case.interface"
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "../common/cast-member-output"
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository"
import {
  CastMember,
  CastMemberId,
} from "@core/cast-member/domain/cast-member.aggregate"
import { NotFoundError } from "@core/shared/domain/errors/not-found.error"

export class GetCastMemberUseCase
  implements IUseCase<IGetCastMemberInput, IGetCastMemberOutput>
{
  constructor(private readonly castMemberRepo: ICastMemberRepository) {}

  async execute(input: IGetCastMemberInput): Promise<CastMemberOutput> {
    const uuid = new CastMemberId(input.id)
    const castMember = await this.castMemberRepo.findById(uuid)

    if (!castMember) {
      throw new NotFoundError(uuid, CastMember)
    }

    return CastMemberOutputMapper.toOutput(castMember)
  }
}

export type IGetCastMemberInput = {
  id: string
}

export type IGetCastMemberOutput = CastMemberOutput
