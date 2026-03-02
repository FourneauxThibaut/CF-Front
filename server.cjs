const express = require('express')
const path = require('path')

const app = express()
const dir = path.join(__dirname, 'dist')
app.use(express.static(dir))
app.get('*', (_, res) => res.sendFile(path.join(dir, 'index.html')))

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on', port))
