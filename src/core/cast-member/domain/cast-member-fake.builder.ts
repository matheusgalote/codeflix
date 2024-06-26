import { Chance } from "chance"
import { CastMember, CastMemberId } from "./cast-member.aggregate"
import { CastMemberType } from "./cast-member-type.vo"

type PropOrFactory<T> = T | ((index: number) => T)

export class CastMemberFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _castmember_id: PropOrFactory<CastMemberId> | undefined = undefined
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _name: PropOrFactory<string> = (_index) => this.chance.word()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _type: PropOrFactory<CastMemberType> | undefined = undefined

  // auto generated in entity
  private _created_at: PropOrFactory<Date> | undefined = undefined

  private countObjs

  private chance: Chance.Chance

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs
    this.chance = Chance()
  }

  static aCastMember() {
    return new CastMemberFakeBuilder<CastMember>()
  }

  static theCastMembers(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs)
  }

  static anActor() {
    return new CastMemberFakeBuilder<CastMember>().withType(
      CastMemberType.createAnActor(),
    )
  }

  static aDirector() {
    return new CastMemberFakeBuilder<CastMember>().withType(
      CastMemberType.createADirector(),
    )
  }

  withUuid(valueOrFactory: PropOrFactory<CastMemberId>) {
    this._castmember_id = valueOrFactory
    return this
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory
    return this
  }

  withType(valueOrFactory: PropOrFactory<CastMemberType>) {
    this._type = valueOrFactory
    return this
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory
    return this
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 })
    return this
  }

  get castmember_id() {
    return this.getValue("castmember_id")
  }

  get name() {
    return this.getValue("name")
  }

  get type() {
    return this.getValue("type")
  }

  get created_at() {
    return this.getValue("created_at")
  }

  private getValue(prop: any) {
    const optional = ["castmember_id", "created_at"]
    const privateProp = `_${prop}` as keyof this
    if (!this[privateProp] && optional.includes(prop)) {
      // TODO - Criar erro personalizado
      throw new Error(`Property ${prop} not have a factory, use 'with' methods`)
    }
    return this.callFactory(this[privateProp], 0)
  }

  build(): TBuild {
    const castMembers = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const castMember = new CastMember({
          castmember_id: !this._castmember_id
            ? undefined
            : this.callFactory(this._castmember_id, index),
          name: this.callFactory(this._name, index),
          type: !this._type
            ? CastMemberType.randomCastMemberType()
            : this.callFactory(this._type, index),
          ...(this._created_at && {
            created_at: this.callFactory(this._created_at, index),
          }),
        })
        castMember.validate()
        return castMember
      })
    return this.countObjs === 1 ? (castMembers[0] as any) : castMembers
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue
  }
}
