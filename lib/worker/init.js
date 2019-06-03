'use strict'

const path = require('path')
const Module = require('module')

// We modified the original process.argv to let node.js load the
// init.js, we need to restore it here.
process.argv.splice(1, 1)

// Clear search paths.
require('../common/reset-search-paths')

// Import common settings.
require('@electron/internal/common/init')

// Export node bindings to global.
global.require = __non_webpack_require__ // eslint-disable-line
global.module = Module._cache[__filename]

// Set the __filename to the path of html file if it is file: protocol.
if (self.location.protocol === 'file:') {
  const pathname = process.platform === 'win32' && self.location.pathname[0] === '/' ? self.location.pathname.substr(1) : self.location.pathname
  global.__filename = path.normalize(decodeURIComponent(pathname))
  global.__dirname = path.dirname(global.__filename)

  // Set module's filename so relative require can work as expected.
  global.module.filename = global.__filename

  // Also search for module under the html file.
  global.module.paths = global.module.paths.concat(Module._nodeModulePaths(global.__dirname))
} else {
  global.__filename = __filename
  global.__dirname = __dirname
}
