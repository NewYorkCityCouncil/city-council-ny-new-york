var fs = require('fs');
var path = require('path');
var slug = require('slug');

var pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

var geojson, data;
var geojson_file = path.join(__dirname, '../source/city-council.geojson');
var data_file = path.join(__dirname, '../city-council/data/city-council-data.json');

var collection = {
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "provider": {
    "name": "Civil Services",
    "email": "hello@civil.services",
    "homepage": "https://civil.services",
    "repository": "https://civilserviceusa.github.io/city-council-ny-new-york/"
  },
  "features": []
};

/**
 * Get JSON Properties for Given District
 * @param district
 * @returns {*}
 */
function getProperties(district) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].district === district) {
      return data[i];
    }
  }
}

/**
 * Create Single District Map
 * @param data - GeoJSON Data for District
 */
function createDistrictMap(data) {
  var filename = 'city-council/geojson/city-council-' + slug(pjson.cityData.state_code, { lower: true, replacement: '-' }) + '-' + slug(pjson.cityData.city_name, { lower: true, replacement: '-' }) + '-' + slug(data.district, { lower: true, replacement: '-' }) + '.geojson';
  fs.writeFile(filename, JSON.stringify(geojson, null, 2));

  console.log('✓ Processed ./' + filename);
}

/**
 * Create All Districts Map
 */
function createDistrictsMap() {
  var filename = 'city-council/geojson/city-council-' + slug(pjson.cityData.state_code, { lower: true, replacement: '-' }) + '-' + slug(pjson.cityData.city_name, { lower: true, replacement: '-' }) + '.geojson';
  fs.writeFile(filename, JSON.stringify(collection, null, 2));

  console.log('✓ Processed ./' + filename);
}


if (!fs.existsSync(geojson_file)) {
  console.error('× Missing GeoJSON Source: ' + geojson_file.replace(path.join(__dirname, '../'), './'));
} else if (!fs.existsSync(data_file)) {
  console.error('× Missing JSON Data: ' + data_file.replace(path.join(__dirname, '../'), './'));
} else {

  geojson = JSON.parse(fs.readFileSync(geojson_file, 'utf8'));
  data = JSON.parse(fs.readFileSync(data_file, 'utf8'));

  for (var i = 0; i < geojson.features.length; i++) {
    geojson.features[i].properties = getProperties(geojson.features[i].district);

    collection.features.push(geojson.features[i]);

    createDistrictMap(geojson.features[i]);
  }

  createDistrictsMap();

  console.log('\n☆ GeoJSON Creation Completed ' + '\n');
}

