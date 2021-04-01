export function handleIDNo (txt) {
  return txt.replace(/^(\d{6})\d+(\d{4})$/, '$1******$2')
}
