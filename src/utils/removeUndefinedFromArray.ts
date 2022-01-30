export function removeUndefinedFromArray<A>(a: Array<A | undefined>): A[] {
  return a.reduce((b: A[], item) => {
    if (item) {
      b.push(item)
    }
    return b
  }, [])
}
