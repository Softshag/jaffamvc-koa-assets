FileStore = require '../lib/file-store'


fs = require 'fs'
{compare} = require('file-compare')


errors = require '../lib/errors'
helper = require './helpers'


describe 'file store', ->

  before ->
    helper.deleteFolderRecursive helper.uploadPath
    @fs = new FileStore
      root: helper.uploadPath
      rootURL: 'http://localhost'

  after ->
    helper.deleteFolderRecursive helper.uploadPath

  it 'should create file', (done) ->
    stream = fs.createReadStream helper.testFile

    @fs.create stream, path: 'image.png'
    .then (url) ->

      url.should.equal 'http://localhost/image.png'
      (fs.existsSync(__dirname + '/uploads/image.png')).should.be.true
      done()
    , done

  it 'should create nested file', (done) ->
    stream = fs.createReadStream helper.testFile
    ud = '/somedir/test/image.png'
    @fs.create stream, path:'/somedir/test/image.png'
    .then (url) ->
      url.should.equal 'http://localhost/somedir/test/image.png'

      compare helper.testFile, __dirname + '/uploads' + ud, (ret, err) ->
        (ret).should.be.true
        done err
    , done

  it 'should remove file', (done) ->

    @fs.remove('/somedir/test/image.png')
    .then ->
      (fs.existsSync(__dirname + '/uploads//somedir/test/image.png')).should.be.false
      done()
    , done

  it 'should throw not NotFoundError when trying to remove a file that does not exist', (done) ->

    @fs.remove('/somedir/test/image.png')
    .then ->
      (true == true).should.be.false
      done()
    , (e) ->
      e.should.be.instanceof errors.NotFoundError
      done()

  it 'should list all files', ->

  it 'should stream a file', (done) ->
    @fs.stream 'image.png'
    .then (stream) ->
      ws = fs.createWriteStream helper.uploadPath + '/tmp_image.png'
      stream.pipe ws
      ws.on 'finish', ->
        compare helper.testFile, helper.uploadPath + '/tmp_image.png', (ret, err) ->
          (ret).should.be.true
          done err

  it 'should check path', ->
    @fs.has('image.png')
    .then (ret) ->
      ret.should.be.true
