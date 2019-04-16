import path from 'path'
import setup from './setup'

const {engines} = require(path.join(process.cwd(), 'package.json'))

setup(engines)
