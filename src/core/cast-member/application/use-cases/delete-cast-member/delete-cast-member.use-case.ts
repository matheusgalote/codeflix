import { CastMemberId } from "@core/cast-member/domain/cast-member.aggregate"
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository"
import { IUseCase } from "@core/shared/application/use-case.interface"

export class DeleteCastMemberUseCase
  implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
  constructor(private readonly categoryRepo: ICastMemberRepository) {}

  async execute(input: DeleteCategoryInput): Promise<void> {
    const uuid = new CastMemberId(input.id)
    await this.categoryRepo.delete(uuid)
  }
}

export type DeleteCategoryInput = {
  id: string
}

export type DeleteCategoryOutput = void
