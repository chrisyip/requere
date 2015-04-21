var expect = require('chai').expect
var requere = require('../../index.js')

describe('requere()', function () {
  it('should be a function', function () {
    expect(requere).to.be.a('function')
  })

  it('should require module correctly', function () {
    var path = requere('path')
    expect(path).to.equal(require('path'))
    expect(require('../textual/a.js')).to.equal(requere('test/textual/a.js'))
  })

  it('should resolve module start from module root', function () {
    var res1 = requere('test/textual/nested/nested')
    var res2 = require('../../test/textual/nested/nested.js')

    expect(res1).to.be.equal(res2)
  })

  it('should work with transipler', function () {
    require('coffee-script/register')

    var b = requere('test/textual/b.coffee')
    expect(b()).to.equal('Module B')
  })

  it('should throw exception if module cannot found', function () {
    var func = function () {
      requere('module_not_found')
    }
    expect(func).to.throw('Cannot find module \'module_not_found\'')
  })
})
