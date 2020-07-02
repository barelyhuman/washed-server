module.exports = (req, res, middleware) => {
  return new Promise((resolve, reject) => {
    middleware(req, res, (result) => {
      if (result instanceof Error) {
        console.error(result)
        return reject(result)
      }
      return resolve(result)
    })
  })
}
