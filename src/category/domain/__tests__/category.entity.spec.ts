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

describe("Category Validator", () => {
  describe("create command", () => {
    test("should an invalid category with name property", () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      })

      expect(() => Category.create({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      })

      expect(() => Category.create({ name: 2 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      })

      expect(() =>
        Category.create({ name: "t".repeat(255) })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      })
    })
  })

  test("should a invalid category using description property", () => {
    expect(() => {
      Category.create({ description: 5 } as any)
    }).containsErrorMessages({
      description: ["description must be a string"],
    })
  })

  test("should a invalid category using is_active property", () => {
    expect(() => {
      Category.create({ is_active: 5 } as any)
    }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    })
  })

  describe("changeName method", () => {
    test("should a invalid category using name property", () => {
      const category = Category.create({ name: "Movie" })
      expect(() => category.changeName(null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      })

      expect(() => category.changeName("")).containsErrorMessages({
        name: ["name should not be empty"],
      })

      expect(() => category.changeName(5 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      })

      expect(() => category.changeName("t".repeat(256))).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      })
    })
  })

  describe("changeDescription method", () => {
    test("should a invalid category using description property", () => {
      const category = Category.create({ name: "Movie" })
      expect(() => category.changeDescription(5 as any)).containsErrorMessages({
        description: ["description must be a string"],
      })
    })
  })
})
