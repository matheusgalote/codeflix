import { IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator"

export type UpdateCastMemberInputConstructorProps = {
  id: string
  name?: string
  type?: number | null
}

export class UpdateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  type?: number | null

  constructor(props?: UpdateCastMemberInputConstructorProps) {
    if (!props) return
    this.id = props.id
    props.name && (this.name = props.name)
    props.type && (this.type = props.type)
  }
}

export class ValidateUpdateCastMemberInput {
  static validate(input: UpdateCastMemberInput) {
    return validateSync(input)
  }
}
