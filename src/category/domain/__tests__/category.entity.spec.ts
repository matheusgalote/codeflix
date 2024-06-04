import { Uuid } from "../../../shared/domain/value-objects/uuid.vo"
import { Category } from "../category.entity"

describe("Category Unit Tests", () => {
  let validateSpy: any
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate")
  })

  describe("constructor", () => {
    test("constructor 1 - should create a Category with name", () => {
      // AAA - Arrange Act Assert
      // Arrange
      const categoryData = {
        name: "Movie",
      }

      // Act
      const category = new Category(categoryData)

      // Assert
      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe("Movie")
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })

    test("constructor 2 - should create a Category with all data", () => {
      const created_at = new Date()
      const category = new Category({
        name: "Movie",
        description: "movie desc",
        is_active: false,
        created_at,
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe("Movie")
      expect(category.description).toBe("movie desc")
      expect(category.is_active).toBeFalsy()
      expect(category.created_at).toBe(created_at)
    })

    test("constructor 3 - should create a Category with name and description", () => {
      const category = new Category({
        name: "Movie",
        description: "movie desc",
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe("Movie")
      expect(category.description).toBe("movie desc")
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })
  })

  describe("create command", () => {
    test("should create a Category", () => {
      const category = Category.create({
        name: "Movie",
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe("Movie")
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test("should create a Category with name and description", () => {
      const category = Category.create({
        name: "Movie",
        description: "movie desc",
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe("Movie")
      expect(category.description).toBe("movie desc")
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test("should create a Category with name, description and is_active", () => {
      const category = Category.create({
        name: "Movie",
        description: "movie desc",
        is_active: false,
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe("Movie")
      expect(category.description).toBe("movie desc")
      expect(category.is_active).toBeFalsy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe("category_id field", () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ]
    test.each(arrange)("id = %j", ({ category_id }) => {
      const category = new Category({
        name: "Movie",
        category_id: category_id as Uuid,
      })
      expect(category.category_id).toBeInstanceOf(Uuid)
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id)
      }
    })
  })

  test("should change a Category name", () => {
    const category = Category.create({
      name: "Movie",
    })
    category.changeName("Movie 2")
    expect(category.name).toBe("Movie 2")
    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  test("should change a Category description", () => {
    const category = Category.create({
      name: "Movie",
      description: "movie desc",
    })
    category.changeDescription("movie desc 2")
    expect(category.description).toBe("movie desc 2")
    expect(validateSpy).toHaveBeenCalledTimes(2)
  })

  test("should deactivate a Category", () => {
    const category = Category.create({
      name: "Movie",
    })
    category.deactivate()
    expect(category.is_active).toBeFalsy()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test("should activate a Category", () => {
    const category = Category.create({
      name: "Movie",
      is_active: false,
    })
    category.activate()
    expect(category.is_active).toBeTruthy()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})
