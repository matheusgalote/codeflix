import { SortDirection } from "@core/shared/domain/repository/search-params"
import { CastMembersController } from "../cast-members.controller"
import { CreateCastMemberOutput } from "@core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case"
import { CreateCastMemberDto } from "../dto/create-cast-member.dto"
import {
  CastMemberPresenter,
  CastMembersCollectionPresenter,
} from "../cast-members.presenter"
import {
  UpdateCastMemberInput,
  UpdateCastMemberOutput,
} from "@core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case"
import { GetCastMemberOutput } from "@core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case"
import { ListCastMembersOutput } from "@core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case"

describe("CategoriesController Unit Tests", () => {
  let controller: CastMembersController

  beforeEach(async () => {
    controller = new CastMembersController()
  })

  test("should creates a cast member", async () => {
    //Arrange
    const output: CreateCastMemberOutput = {
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
      name: "Movie",
      type: "Director",
      created_at: new Date(),
    }
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    //@ts-expect-error defined part of methods
    controller["createUseCase"] = mockCreateUseCase
    const input: CreateCastMemberDto = {
      name: "Movie",
      type: 1,
    }

    //Act
    const presenter = await controller.create(input)

    //Assert
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input)
    expect(presenter).toBeInstanceOf(CastMemberPresenter)
    expect(presenter).toStrictEqual(new CastMemberPresenter(output))
  })

  test("should updates a cast member", async () => {
    const id = "9366b7dc-2d71-4799-b91c-c64adb205104"
    const output: UpdateCastMemberOutput = {
      id,
      name: "Joe",
      type: "Actor",
      created_at: new Date(),
    }
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    //@ts-expect-error defined part of methods
    controller["updateUseCase"] = mockUpdateUseCase
    const input: Omit<UpdateCastMemberInput, "id"> = {
      name: "Joe doe",
      type: 2,
    }
    const presenter = await controller.update(id, input)
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input })
    expect(presenter).toBeInstanceOf(CastMemberPresenter)
    expect(presenter).toStrictEqual(new CastMemberPresenter(output))
  })

  test("should deletes a cast member", async () => {
    const expectedOutput = undefined
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    }
    //@ts-expect-error defined part of methods
    controller["deleteUseCase"] = mockDeleteUseCase
    const id = "9366b7dc-2d71-4799-b91c-c64adb205104"
    expect(controller.remove(id)).toBeInstanceOf(Promise)
    const output = await controller.remove(id)
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id })
    expect(expectedOutput).toStrictEqual(output)
  })

  test("should gets a cast member", async () => {
    const id = "9366b7dc-2d71-4799-b91c-c64adb205104"
    const output: GetCastMemberOutput = {
      id,
      name: "Movie",
      type: "Actor",
      created_at: new Date(),
    }
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    //@ts-expect-error defined part of methods
    controller["getUseCase"] = mockGetUseCase
    const presenter = await controller.findOne(id)
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id })
    expect(presenter).toBeInstanceOf(CastMemberPresenter)
    expect(presenter).toStrictEqual(new CastMemberPresenter(output))
  })

  test("should list cast members", async () => {
    const output: ListCastMembersOutput = {
      items: [
        {
          id: "9366b7dc-2d71-4799-b91c-c64adb205104",
          name: "Movie",
          type: "Actor",
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    }
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    //@ts-expect-error defined part of methods
    controller["listUseCase"] = mockListUseCase
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc" as SortDirection,
      filter: {
        name: "test",
      },
    }
    const presenter = await controller.search(searchParams)
    expect(presenter).toBeInstanceOf(CastMembersCollectionPresenter)
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams)
    expect(presenter).toEqual(new CastMembersCollectionPresenter(output))
  })
})
