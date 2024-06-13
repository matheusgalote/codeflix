import {
  CastMemberFilter,
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from "@core/cast-member/domain/cast-member.repository"
import {
  PaginationOutput,
  PaginationOutputMapper,
} from "@core/shared/application/pagination-output"
import { IUseCase } from "@core/shared/application/use-case.interface"
import { SortDirection } from "@core/shared/domain/repository/search-params"
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "../common/cast-member-output"

export class ListCastMemberUseCase
  implements IUseCase<ListCastMemberInput, ListCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: ListCastMemberInput): Promise<ListCastMemberOutput> {
    const params = new CastMemberSearchParams(input)
    const searchResult = await this.castMemberRepo.search(params)
    return this.toOutput(searchResult)
  }

  private toOutput(searchResult: CastMemberSearchResult): ListCastMemberOutput {
    const { items: _items } = searchResult
    const items = _items.map((item) => CastMemberOutputMapper.toOutput(item))
    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}

export type ListCastMemberInput = {
  page?: number
  per_page?: number
  sort?: string | null
  sort_dir?: SortDirection | null
  filter?: CastMemberFilter | null
}

export type ListCastMemberOutput = PaginationOutput<CastMemberOutput>
