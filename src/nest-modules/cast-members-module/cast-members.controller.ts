import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  ParseUUIDPipe,
} from "@nestjs/common"
import { CreateCastMemberDto } from "./dto/create-cast-member.dto"
import { UpdateCastMemberDto } from "./dto/update-cast-member.dto"
import { CreateCastMemberUseCase } from "@core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case"
import { UpdateCastMemberUseCase } from "@core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case"
import { DeleteCastMemberUseCase } from "@core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case"
import { GetCastMemberUseCase } from "@core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case"
import {
  ListCastMembersOutput,
  ListCastMembersUseCase,
} from "@core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case"
import { CastMemberOutput } from "@core/cast-member/application/use-cases/common/cast-member-output"
import {
  CastMemberPresenter,
  CastMembersCollectionPresenter,
} from "./cast-members.presenter"
import { SearchCastMemberDto } from "./dto/search-cast-member.dto"

@Controller("cast-members")
export class CastMembersController {
  @Inject(CreateCastMemberUseCase)
  private createUseCase: CreateCastMemberUseCase

  @Inject(UpdateCastMemberUseCase)
  private updateUseCase: UpdateCastMemberUseCase

  @Inject(DeleteCastMemberUseCase)
  private deleteUseCase: DeleteCastMemberUseCase

  @Inject(GetCastMemberUseCase)
  private getUseCase: GetCastMemberUseCase

  @Inject(ListCastMembersUseCase)
  private listUseCase: ListCastMembersUseCase

  @Post()
  async create(@Body() createCastMemberDto: CreateCastMemberDto) {
    const output = await this.createUseCase.execute(createCastMemberDto)
    return CastMembersController.serialize(output)
  }

  @Get()
  async search(@Query() searchParamDto: SearchCastMemberDto) {
    const output = await this.listUseCase.execute(searchParamDto)
    return CastMembersController.serializeCollection(output)
  }

  @Get(":id")
  async findOne(
    @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id })
    return CastMembersController.serialize(output)
  }

  @Patch(":id")
  async update(
    @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCastMemberDto: UpdateCastMemberDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateCastMemberDto,
    })
    return CastMembersController.serialize(output)
  }

  @Delete(":id")
  remove(
    @Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.deleteUseCase.execute({ id })
  }

  private static serialize(output: CastMemberOutput) {
    return new CastMemberPresenter(output)
  }

  static serializeCollection(output: ListCastMembersOutput) {
    return new CastMembersCollectionPresenter(output)
  }
}
