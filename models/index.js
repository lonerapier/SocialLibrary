'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = 'development';
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
// var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sequelize = new Sequelize('postgres://lupxiiaufiffys:4cf19e92e5f8b823fa13de42f2a8eba98926ba97c6cc2db98862ab0ca4768a39@ec2-54-75-230-253.eu-west-1.compute.amazonaws.com:5432/d7hapcm2tv4kbj');

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
