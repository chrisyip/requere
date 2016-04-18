'use strict'

const expect = require('chai').expect
const requere = require('../index.js')

describe('requere()', function () {
  it('should be a function', function () {
    expect(requere).to.be.a('function')
  })

  it('should load module correctly', function () {
    const path = requere('path')
    expect(path).to.equal(require('path'))
    expect(require('./textual/a.js')).to.equal(requere('test/textual/a.js'))

    expect(requere(path.resolve(process.cwd(), './test/textual/a'))).to.equal('Module A')
  })

  it('should load built-in module', function () {
    expect(requere('path')).to.equal(require('path'))
  })

  it('should load installed module', function () {
    expect(requere('cson')).to.equal(require('cson'))
  })

  it('should resolve module start from module root', function () {
    const res1 = requere('test/textual/nested/index')
    const res2 = require('../test/textual/nested/index.js')

    expect(res1).to.be.equal(res2)
  })

  it('should work with transipler', function () {
    require('coffee-script/register')

    const latte = requere('test/textual/latte.coffee')
    expect(latte).to.equal('Latte is tasty')
  })

  it('should throw exception if module cannot found', function () {
    const func = function () {
      requere('module_not_found')
    }
    expect(func).to.throw(Error, /module_not_found/)
  })

  it('should load index.js when requiring a directory', function () {
    expect(requere('test/textual/foo/')).to.equal('foo/index.js')
  })

  it('should request has no extname and exists, should load it', function () {
    expect(requere('test/textual/bar')).to.equal('file bar')
  })

  it('should request has no extname and not exist, should load it with supported extension names', function () {
    expect(requere('test/textual/baz')).to.equal('file baz.js')
  })

  it('should throw error with non-string path', function () {
    expect(() => requere(undefined)).to.throw(Error, 'missing path')
    expect(() => requere(true)).to.throw(Error, 'path must be a string')
    expect(() => requere({})).to.throw(Error, 'path must be a string')
  })

  describe('glob', function() {
    it('should support glob', function () {
      const result = requere('test/textual/*.js')
      const keys = Object.keys(result)
      expect(keys.length).to.equal(3)
      expect(result[keys[0]]).to.equal('Module A')
      expect(result[keys[1]]).to.equal('file bar.js')
      expect(result[keys[2]]).to.equal('file baz.js')

      const bResult = requere('./textual/*.js')
      expect(result).to.deep.equal(bResult)

      const nestedResult = requere('test/textual/nested/**/*')
      const nestedKeys = Object.keys(nestedResult)

      expect(nestedKeys.length).to.equal(3)
      expect(nestedKeys[0].endsWith('test/textual/nested/bar/bar.js'))
        .to.be.true
      expect(nestedKeys[1].endsWith('test/textual/nested/foo.js'))
        .to.be.true
      expect(nestedKeys[2].endsWith('test/textual/nested/index.js'))
        .to.be.true
    })

    it('should always return an object', function () {
      expect(requere('folder_not_exists/**/*.js')).to.be.an('object')
      expect(requere('lib/**/*.js')).to.be.an('object')
    })

    it(
      'should only load modules with supported extname with `onlySupportedExtname` is true',
      function () {
        expect(requere('test/textual/**/*', true)).to.be.an('object')
      }
    )
  })
})

describe('requere.register()', function() {
  it('should support custom module loader', function () {
    requere.register('.cson', require('cson').load.bind(require('cson')))

    const cson = requere('test/textual/cson.cson')

    expect(cson).to.be.an('object')
    expect(cson).to.have.property('greatDocumentaries')
  })
})
