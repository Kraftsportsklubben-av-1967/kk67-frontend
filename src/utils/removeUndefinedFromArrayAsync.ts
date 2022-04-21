import { removeUndefinedFromArray } from './removeUndefinedFromArray'

export async function removeUndefinedFromArrayAsync<A>(a: Promise<A | undefined>[]): Promise<A[]> {
  return removeUndefinedFromArray(await Promise.all(a))
}
