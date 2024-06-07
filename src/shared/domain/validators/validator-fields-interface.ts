import { Notification } from "./notification"

export type FieldsErrors =
  | {
      [field: string]: string[]
    }
  | string

export interface IValidatorFields<PropsValidated> {
  validate(notification: Notification, data: any, fields: string[]): boolean
}
