
fs = require 'fs'
Path = require 'path'
co = require 'co'
mzfs = require 'mz/fs'
Mime = require 'mime'
exports.deleteFolderRecursive = (path) ->
  if fs.existsSync(path)
    fs.readdirSync(path).forEach (file,index) ->
      curPath = path + "/" + file
      if fs.lstatSync(curPath).isDirectory()
        exports.deleteFolderRecursive(curPath)
      else # // delete file
        fs.unlinkSync(curPath)

    fs.rmdirSync(path)


exports.testFile = Path.resolve __dirname, '../fixtures/image.png'
exports.uploadPath = Path.resolve __dirname,  '../uploads'


exports.meta = (path) ->
  co ->
    stats = yield mzfs.stat(exports.testFile)
    mime = Mime.lookup(exports.testFile)

    asset =
      path: path.replace(/\s+/mig, '_')
      mime: mime
      size: stats.size
    asset
