'use strict';
let rethinkdbdash = require('rethinkdbdash'),
    view          = require('./view');

let r = rethinkdbdash({db: 'game'});

function pollingUpdates () {
  r.table('scoreboard')
    .orderBy({index: r.desc('score')})
    .limit(100)
    .then(function (rows) {
      view.render(rows);
      setTimeout(function(){
        pollingUpdates();
      }, 2000);
    });
}

function pushUpdates () {
  r.table('scoreboard')
    .orderBy({index: r.desc('score')})
    .limit(100)
    .changes()
    .then(function (cursor) {
      cursor.each(function(err, record){
        view.render(record);
      });
    });
}

pushUpdates();
//pollingUpdates();