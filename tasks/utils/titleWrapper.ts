const defaultTitle = 'helpwave tasks'

const titleWrapper = (title?: string) => title ? `${title} ~ ${defaultTitle}` : defaultTitle

export default titleWrapper
