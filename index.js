const express = require('express');
const app = express();
const port = 9292;
const {
  getModels
} = require('node-car-api');
const {
  getBrands
} = require('node-car-api');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});


//function bulk-api
function bulking(theString) {
  client.bulk({
    body: [theString]
  });
}

//populate
var json = '';
var id = 0;
var fs = require('fs');
async function populate() {
  var brands = await getBrands();
  for(var i=0; i < brands.length; i++) {
    var brand = brands[i];
    var models = await getModels(brand);
    models.forEach(function(element) {
      json += '{ "index":{ "_index": "suv", "_type":"suv", "_id": "' + id + '"} }\n';
      json += JSON.stringify(element);
      json += '\n';
      id++;
    });
  };
  console.log('test1');
  fs.writeFile("result.json", json, function(err) {
    if (err) {
      console.log(err);
    }
  });
  bulking(json);
}
populate();

//route : /populate
app.get('/populate', (req, res) => {
  populate
  res.send('Populate completed')
});

// route : /suv
app.get('/suv', (req, res) => {
  res.send('Hello')
});

//port
app.listen(port, () => {
  console.log('Server start on port ' + port);
});
