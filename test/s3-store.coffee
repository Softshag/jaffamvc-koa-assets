FileStore = require '../lib/s3-store'


fs = require 'fs'
{compare} = require('file-compare')


errors = require '../lib/errors'
helper = require './helpers'
utils = require '../lib/utils'

describe.skip 's3 store', ->

  before ->

    @fs = new FileStore
      key: process.env.S3_KEY
      secret: process.env.S3_SECRET
      bucket: process.env.S3_BUCKET
      maxAge: 10

    helper.meta('image.png').then (asset) =>
      @asset = asset
      utils.mkdirp(helper.uploadPath)

  after ->
    helper.deleteFolderRecursive helper.uploadPath

  it 'should create file',  ->
    stream = fs.createReadStream helper.testFile
    this.timeout(10000);
    @fs.create stream, @asset
    .then (url) ->
      url.should.equal 'https://hifly-images.s3.amazonaws.com/image.png'

  it.skip 'should remove file', (done) ->

    @fs.remove('/somedir/test/image.png')
    .then ->


  it.skip 'should throw not NotFoundError when trying to remove a file that does not exist', (done) ->

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
      ws = fs.createWriteStream helper.uploadPath + '/tmp_image_s3.png'
      stream.pipe ws
      ws.on 'finish', ->
        compare helper.testFile, helper.uploadPath + '/tmp_image_s3.png', (ret, err) ->
          (ret).should.be.true
          done err

  it 'should check path', ->
    @fs.has('image.png')
    .then (ret) ->
      ret.should.be.true
