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
      const results = requere('test/textual/*.js')
      expect(results.length).to.equal(3)
      expect(results[0]).to.equal('Module A')
      expect(results[2]).to.equal('file baz.js')

      const bResults = requere('./textual/*.js')
      expect(results).to.deep.equal(bResults)
    })

    it('should always return an array', function () {
      expect(requere('folder_not_exists/**/*.js')).to.be.an('array')
      expect(requere('lib/**/*.js')).to.be.an('array')
    })

    it(
      'should only load modules with supported extname with `onlySupportedExtname` is true',
      function () {
        expect(requere('test/textual/**/*', true)).to.be.an('array')
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
