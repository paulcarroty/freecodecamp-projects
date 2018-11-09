//const fetch = require('node-fetch');
const URL = 'https://gist.githubusercontent.com/paulcarroty/ad17f09106986e53ff651cc0931ce101/raw/b81c1fbebe1f45882b4ef4243998562598ffe04c/quotes.json';

let quotes;

let getJson = async (url) => {
  let data = await fetch(url);
  let json = await data.json();
  //console.log(quote);
  let extrJson = json.quotes;
  return extrJson;
}



let getElements = async () => {
  quotes = quotes || await getJson(URL);
  let quote = await quotes[Math.floor(Math.random() * quotes.length)];
  let text = await quote.quote;
  let author = await quote.author;
  let img = await quote.img;
  document.getElementById('img').src = img;
  document.getElementById('text').innerHTML = '‘' + text + '’';
  document.getElementById('author').innerHTML = author;
}


getElements();