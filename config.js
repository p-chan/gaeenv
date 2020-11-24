;(() => {
  const options = {}

  if (process.env.GAEENV_CONFIG_PATH) {
    options.path = process.env.GAEENV_CONFIG_PATH
  }

  if (process.env.GAEENV_CONFIG_ENCODING) {
    options.encoding = process.env.GAEENV_CONFIG_ENCODING
  }

  require('./dist').config(options)
})()
