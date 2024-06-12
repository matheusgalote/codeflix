import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo"
import { Category } from "../../../../domain/category.aggregate"
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository"
import { DeleteCategoryUseCase } from "../delete-category.use-case"

describe("DeleteCategoryUseCase Unit Tests", () => {
  let useCase: DeleteCategoryUseCase
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new DeleteCategoryUseCase(repository)
  })

  test("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new InvalidUuidError(),
    )

    const uuid = new Uuid()

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category),
    )
  })

  test("should delete a category", async () => {
    const items = [Category.fake().aCategory().withName("test 1").build()]
    repository.items = items
    await useCase.execute({
      id: items[0].category_id.id,
    })
    expect(repository.items).toHaveLength(0)
  })
})
