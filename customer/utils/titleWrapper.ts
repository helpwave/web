const defaultTitle = 'helpwave customer'

const titleWrapper = (title?: string) => title ? `${title} ~ ${defaultTitle}` : defaultTitle

export default titleWrapper
