import { CastMemberFakeBuilder } from "@core/cast-member/domain/cast-member-fake.builder"
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo"
import { CastMemberOutputMapper } from "./cast-member-output"

describe("CastMember output unit tests", () => {
  test("should return cast member output", () => {
    const created_at = new Date()
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withName("Joe")
      .withType(new CastMemberType(2))
      .withCreatedAt(created_at)
      .build()

    const output = CastMemberOutputMapper.toOutput(castMember)
    expect(output).toEqual({
      id: castMember.castmember_id.id,
      name: "Joe",
      type: "Actor",
      created_at,
    })
  })
})
