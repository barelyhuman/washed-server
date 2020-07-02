module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(404)
    return res.end
  }

  return res.send({
    status: 'up'
  })
}
