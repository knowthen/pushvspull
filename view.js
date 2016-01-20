'use strict';
let console = require('better-console'),
    Table   = require('easy-table'),
    colors  = require('colors'),
    records = {};

function print (record){
  return function(val, width){
    return Table.string(String(val).green);
  }
}

function clearColor (record, ms) {
  setTimeout(function(){
    record.isNew = false;
    _render();
  }, ms);
}

function render (record) {
  if(Array.isArray(record)){
    records = {};
    record.forEach(function(row){
      row.isNew = true;
      records[row.id] = row;
      clearColor(row, 1000);
    })
  }
  if(record && record.new_val){
    record.new_val.isNew = true;
    records[record.new_val.id] = record.new_val;
    clearColor(record.new_val, 1000);
  }
  if(record && record.old_val){
    if(record.old_val.id in records){
       delete records[record.old_val.id];
    }
  }
  _render();
}

function _render () {
  let table = new Table;
  let ids = Object.keys(records);
  ids.forEach(function(id){
    let record = records[id];
    let fn = null;// print(record);
    if(record.isNew){
      fn = print(record);
    }
    table.cell('Player', record.name, fn, 20);
    table.cell('Bio', record.bio, fn, 40);
    table.cell('Score', record.score, fn, 10);
    table.newRow();
  });
  table.sort(['Score|des']);
  console.clear();
  console.log(table.toString());
}

module.exports = {
  render: render
}