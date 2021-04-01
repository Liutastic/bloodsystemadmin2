import { thumb, baseURL } from '@/config/keys'

export default (url) => {
  const regexp = new RegExp(/^http/)
  if (!url) return thumb
  if (regexp.test(url)) {
    return url
  } else {
    return `${baseURL}${url.replace(/\\/g, '/')}`
  }
}
