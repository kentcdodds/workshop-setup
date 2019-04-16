const config = require('kcd-scripts/jest')

config.coverageThreshold.global = {
  branches: 50,
  statements: 60,
  functions: 60,
  lines: 50,
}
