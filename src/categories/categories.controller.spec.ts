import { Test, TestingModule } from "@nestjs/testing"
import { CategoriesController } from "./categories.controller"
import { DatabaseModule } from "src/database/database.module"
import { CategoriesModule } from "./categories.module"
import { ConfigModule } from "src/config/config.module"

describe("CategoriesController", () => {
  let controller: CategoriesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile()

    controller = module.get<CategoriesController>(CategoriesController)
  })

  test("should be defined", () => {
    console.log(controller)
    expect(controller).toBeDefined()
  })
})