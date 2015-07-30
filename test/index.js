'use strict'
var tape = require('tape')
var mlib = require('../index')

module.exports = function () {
  var feedid = '@nUtgCIpqOsv6k5mnWKA4JeJVkJTd9Oz2gmv6rojQeXU=.ed25519'
  var msgid = '%MPB9vxHO0pvi2ve2wh6Do05ZrV7P6ZjUQ+IEYnzLfTs=.sha256'
  var blobid = '&Pe5kTo/V/w4MToasp1IuyMrMcCkQwDOdyzbyD5fy4ac=.sha256'

  var msg = {
    a: feedid,
    b: msgid,
    c: blobid,
    d: { link: feedid, foo: true },
    e: { link: msgid, foo: true },
    f: { link: blobid, foo: true },
    g: [feedid, msgid, blobid],
    h: [
      { link: feedid, foo: true },
      { link: msgid, foo: true },
      { link: blobid, foo: true }
    ],
    i: {
      // none of these will be indexed
      j: feedid,
      k: { link: feedid }
    }
  }

  tape('link', function (t) {

    t.deepEqual(mlib.link(msg.a), { link: feedid })
    t.deepEqual(mlib.link(msg.b), { link: msgid })
    t.deepEqual(mlib.link(msg.c), { link: blobid })
    t.deepEqual(mlib.link(msg.a, 'feed'), { link: feedid })
    t.deepEqual(mlib.link(msg.a, 'msg'), null)
    t.deepEqual(mlib.link(msg.a, 'blob'), null)
    t.deepEqual(mlib.link(msg.b, 'feed'), null)
    t.deepEqual(mlib.link(msg.b, 'msg'), { link: msgid })
    t.deepEqual(mlib.link(msg.b, 'blob'), null)
    t.deepEqual(mlib.link(msg.c, 'msg'), null)
    t.deepEqual(mlib.link(msg.c, 'feed'), null)
    t.deepEqual(mlib.link(msg.c, 'blob'), { link: blobid })

    t.deepEqual(mlib.link(msg.d), { link: feedid, foo: true })
    t.deepEqual(mlib.link(msg.e), { link: msgid, foo: true })
    t.deepEqual(mlib.link(msg.f), { link: blobid, foo: true })
    t.deepEqual(mlib.link(msg.d, 'feed'), { link: feedid, foo: true })
    t.deepEqual(mlib.link(msg.d, 'msg'), null)
    t.deepEqual(mlib.link(msg.d, 'blob'), null)
    t.deepEqual(mlib.link(msg.e, 'feed'), null)
    t.deepEqual(mlib.link(msg.e, 'msg'), { link: msgid, foo: true })
    t.deepEqual(mlib.link(msg.e, 'blob'), null)
    t.deepEqual(mlib.link(msg.f, 'msg'), null)
    t.deepEqual(mlib.link(msg.f, 'feed'), null)
    t.deepEqual(mlib.link(msg.f, 'blob'), { link: blobid, foo: true })

    t.end()
  })

  tape('links', function (t) {

    t.deepEqual(mlib.links(msg.a), [{ link: feedid }])
    t.deepEqual(mlib.links(msg.b), [{ link: msgid }])
    t.deepEqual(mlib.links(msg.c), [{ link: blobid }])
    t.deepEqual(mlib.links(msg.a, 'feed'), [{ link: feedid }])
    t.deepEqual(mlib.links(msg.a, 'msg'), [])
    t.deepEqual(mlib.links(msg.a, 'blob'), [])
    t.deepEqual(mlib.links(msg.b, 'feed'), [])
    t.deepEqual(mlib.links(msg.b, 'msg'), [{ link: msgid }])
    t.deepEqual(mlib.links(msg.b, 'blob'), [])
    t.deepEqual(mlib.links(msg.c, 'msg'), [])
    t.deepEqual(mlib.links(msg.c, 'feed'), [])
    t.deepEqual(mlib.links(msg.c, 'blob'), [{ link: blobid }])

    t.deepEqual(mlib.links(msg.d), [{ link: feedid, foo: true }])
    t.deepEqual(mlib.links(msg.e), [{ link: msgid, foo: true }])
    t.deepEqual(mlib.links(msg.f), [{ link: blobid, foo: true }])
    t.deepEqual(mlib.links(msg.d, 'feed'), [{ link: feedid, foo: true }])
    t.deepEqual(mlib.links(msg.d, 'msg'), [])
    t.deepEqual(mlib.links(msg.d, 'blob'), [])
    t.deepEqual(mlib.links(msg.e, 'feed'), [])
    t.deepEqual(mlib.links(msg.e, 'msg'), [{ link: msgid, foo: true }])
    t.deepEqual(mlib.links(msg.e, 'blob'), [])
    t.deepEqual(mlib.links(msg.f, 'msg'), [])
    t.deepEqual(mlib.links(msg.f, 'feed'), [])
    t.deepEqual(mlib.links(msg.f, 'blob'), [{ link: blobid, foo: true }])

    t.deepEqual(mlib.links(msg.g), [{ link: feedid }, { link: msgid }, { link: blobid }])
    t.deepEqual(mlib.links(msg.h), [{ link: feedid, foo: true }, { link: msgid, foo: true }, { link: blobid, foo: true }])
    t.deepEqual(mlib.links(msg.g, 'feed'), [{ link: feedid }])
    t.deepEqual(mlib.links(msg.g, 'msg'), [{ link: msgid }])
    t.deepEqual(mlib.links(msg.g, 'blob'), [{ link: blobid }])
    t.deepEqual(mlib.links(msg.h, 'feed'), [{ link: feedid, foo: true }])
    t.deepEqual(mlib.links(msg.h, 'msg'), [{ link: msgid, foo: true }])
    t.deepEqual(mlib.links(msg.h, 'blob'), [{ link: blobid, foo: true }])

    t.end()

  })

  tape('indexLinks', function (t) {

    function index (opts) {
      var res = []
      mlib.indexLinks(msg, opts, function (link, rel) {
        res.push(link)
      })
      return res
    }

    t.deepEqual(index(), [
      { link: feedid },
      { link: msgid },
      { link: blobid },
      { link: feedid, foo: true },
      { link: msgid, foo: true },
      { link: blobid, foo: true },
      { link: feedid },
      { link: msgid },
      { link: blobid },
      { link: feedid, foo: true },
      { link: msgid, foo: true },
      { link: blobid, foo: true }
    ])
    t.deepEqual(index('a'), [{ link: feedid }])
    t.deepEqual(index({ rel: 'a' }), [{ link: feedid }])
    t.deepEqual(index({ rel: 'a', feed: true }), [{ link: feedid }])
    t.deepEqual(index({ rel: 'a', msg: true }), [])
    t.deepEqual(index({ feed: true }), [
      { link: feedid },
      { link: feedid, foo: true },
      { link: feedid },
      { link: feedid, foo: true }
    ])
    t.deepEqual(index({ msg: true }), [
      { link: msgid },
      { link: msgid, foo: true },
      { link: msgid },
      { link: msgid, foo: true }
    ])
    t.deepEqual(index({ blob: true }), [
      { link: blobid },
      { link: blobid, foo: true },
      { link: blobid },
      { link: blobid, foo: true }
    ])

    t.end()

  })
}

if(!module.parent)
  module.exports()
