'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
// var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sequelize = new Sequelize('postgres://qojnipcwitkayf:6818780e70eda4341aecee26c241a4136e0c0f2df935c9dcbe13648e9ca06956@ec2-79-125-4-72.eu-west-1.compute.amazonaws.com:5432/d98i1u0p366nee');

const db = {};

  fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
