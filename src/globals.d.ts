/**
 * FB: facebook object form js SDK
 */

interface IFBObject {
  api: (
    path: string,
    method: string,
    param: Record<string, unknown>,
    cb: (resp: any) => void,
  ) => void
}

declare const FB: IFBObject
