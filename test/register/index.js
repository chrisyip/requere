var expect = require('chai').expect
var path = require('path')

require('../../register.js')

describe('requere/register', function () {
  it('should require module correctly', function () {
    var _path = require('path')
    expect(path).to.equal(_path)
  })

  it('should resolve module start from module root', function () {
    var res = require('test/textual/nested/nested')

    expect(res).to.be.equal('foo.js in nested folders')
  })

  it('should work with transipler', function () {
    require('coffee-script/register')

    var b = require('test/textual/b.coffee')
    expect(b()).to.equal('Module B')
  })

  it('should throw exception if module cannot found', function () {
    var func = function () {
      require('module_not_found')
    }
    expect(func).to.throw('Cannot find module \'module_not_found\'')
  })
})
