var fs = require('fs');
var path = require('path');

var collection, data;
var seeder_file = path.join(__dirname, '../city-council/data/20170101000000-city-council-seeder.js');
var data_file = path.join(__dirname, '../city-council/data/city-council-data.json');

function createSeeder() {
  var seeder = "module.exports = {\n" +
  "  up: function (queryInterface) {\n" +
  "    return queryInterface.bulkInsert('senate', " +
  JSON.stringify(collection, null, 4) +
  ", {\n" +
  "      updateOnDuplicate: [ 'bioguide' ]\n" +
  "    });\n" +
  "  },\n" +
  "  down: function (queryInterface) {\n" +
  "    return queryInterface.bulkDelete('senate', null, {});\n" +
  "  }\n" +
  "};\n";

  seeder = seeder.replace(/"queryInterface.sequelize.fn\('GeomFromText', ''\)"/g, 'queryInterface.sequelize.fn(\'GeomFromText\', \'\')');
  seeder = seeder.replace(/"new Date\(\)"/g, 'new Date()');
  seeder = seeder.replace(/"([a-z_]+)":/g, '$1:');

  fs.writeFile(seeder_file, seeder);
}

if (!fs.existsSync(data_file)) {
  console.error('× Missing JSON Data: ' + data_file.replace(path.join(__dirname, '../'), './'));
} else {

  collection = [];
  data = JSON.parse(fs.readFileSync(data_file, 'utf8'));

  for (var i = 0; i < data.length; i++) {
    data[i].shape = 'queryInterface.sequelize.fn(\'GeomFromText\', \'\')'
    data[i].created_date = 'new Date()';
    data[i].modified_date = 'new Date()';
    collection.push(data[i]);
  }

  createSeeder();

  console.log('\n☆ Seeder Creation Completed ' + '\n');
}
