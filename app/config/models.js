import { join } from 'path'
import fs from 'fs'

const models = join(__dirname, '../../app/models')

fs.readdirSync(models)
.filter(file => ~file.search(/^[^\.].*\.js$/))
.forEach(file => require(join(models, file)))