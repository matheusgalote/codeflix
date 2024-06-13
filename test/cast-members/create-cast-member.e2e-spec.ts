import request from "supertest"
import { startApp } from "src/nest-modules/shared-module/testing/helpers"
import { Uuid } from "@core/shared/domain/value-objects/uuid.vo"
import { instanceToPlain } from "class-transformer"
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository"
import { CAST_MEMBER_PROVIDERS } from "src/nest-modules/cast-members-module/cast-members.providers"
import { CreateCastMemberFixture } from "src/nest-modules/cast-members-module/testing/cast-member.fixture"
import { CastMemberOutputMapper } from "@core/cast-member/application/use-cases/common/cast-member-output"
import { CastMembersController } from "src/nest-modules/cast-members-module/cast-members.controller"

describe("CastMemberController (e2e)", () => {
  const appHelper = startApp()
  let castMemberRepo: ICastMemberRepository

  beforeEach(async () => {
    castMemberRepo = appHelper.app.get<ICastMemberRepository>(
      CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    )
  })

  describe("/cast-members (POST)", () => {
    describe("should return a response error with 422 status code when request body is invalid", () => {
      const invalidRequest = CreateCastMemberFixture.arrangeInvalidRequest()
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }))

      test.each(arrange)("when body is $label", ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post("/cast-members")
          .send(value.send_data)
          .expect(422)
          .expect(value.expected)
      })
    })

    describe("should return a response error with 422 status code when throw EntityValidationError", () => {
      const invalidRequest =
        CreateCastMemberFixture.arrangeForEntityValidationError()
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }))

      test.each(arrange)("when body is $label", ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post("/categories")
          .send(value.send_data)
          .expect(422)
          .expect(value.expected)
      })
    })

    describe("should create a category", () => {
      const arrange = CreateCastMemberFixture.arrangeForCreate()

      test.each(arrange)(
        "when body is $send_data",
        async ({ send_data, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post("/cast-members")
            .send(send_data)
            .expect(201)

          const keysInReponse = CreateCastMemberFixture.keysInResponse
          expect(Object.keys(res.body)).toStrictEqual(["data"])
          expect(Object.keys(res.body.data)).toStrictEqual(keysInReponse)
          const id = res.body.data.id
          const castMemberCreated = await castMemberRepo.findById(new Uuid(id))

          const presenter = CastMembersController.serialize(
            CastMemberOutputMapper.toOutput(castMemberCreated),
          )

          const serialized = instanceToPlain(presenter)

          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
            type: presenter.type,
          })
        },
      )
    })
  })
})
