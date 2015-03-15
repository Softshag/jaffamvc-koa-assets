helper = require './helpers'
utils = require '../lib/utils'
MetaStore = require '../lib/meta-store'

describe 'meta store', ->

  fixture =
    path: '/image.png',
    size: 1212121,
    mime: 'image/png'

  before ->

    utils.mkdirp(helper.uploadPath).then =>

      @meta = new MetaStore
        root: helper.uploadPath
      @meta.clear()

  after ->
    helper.deleteFolderRecursive helper.uploadPath

  it 'should create file', ->
    asset =
      path: '/image.png',
      size: 1212121,
      mime: 'image/png'

    @meta.create asset
    @meta.files.length.should.be.eql(1)
    @meta.files[0].should.equal(asset)

  it 'should list all files', ->

    files = @meta.list()
    files.length.should.be.equal 1
    files[0].should.have.properties fixture

  it 'should find a file by path', ->
    file = @meta.find '/image.png'
    file.should.be.an.Object
    file.should.have.properties fixture

  it 'should remove a file by path', ->

    @meta.remove '/image.png'
    (@meta.find('/image.png') is undefined).should.be.true
    @meta.list().length.should.eql 0

