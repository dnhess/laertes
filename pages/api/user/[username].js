const db = require('../../../lib/db')
const escape = require('sql-template-strings')

module.exports = async (req, res) => {
  console.log(req)
  const [user] = await db.query(escape`
    SELECT *
    FROM users
    WHERE username = ${req.query.username}
  `)
  res.status(200).json({ user })
}