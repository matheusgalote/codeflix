import { WrapperDataInterceptor } from "./wrapper-data.interceptor"
import { of, lastValueFrom } from "rxjs"

describe("WrapperDataInterceptor", () => {
  let interceptor: WrapperDataInterceptor

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor()
  })
  test("should wrapper with data key", async () => {
    expect(interceptor).toBeDefined()
    const obs$ = interceptor.intercept(null, {
      handle: () => of({ name: "test" }),
    })
    const result = await lastValueFrom(obs$)
    expect(result).toEqual({ data: { name: "test" } })
  })

  test("should not wrapper when meta key is present", async () => {
    expect(interceptor).toBeDefined()
    const data = { data: { name: "test" }, meta: { total: 1 } }
    const obs$ = interceptor.intercept(null, {
      handle: () => of(data),
    })
    const result = await lastValueFrom(obs$)
    expect(result).toEqual(data)
  })
})
