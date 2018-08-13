//const fetch = require('node-fetch');
const URL = 'https://gist.githubusercontent.com/paulcarroty/ad17f09106986e53ff651cc0931ce101/raw/c2dd53068352d8f37fde2d0649ab3232e3c82096/quotes.json';

let getQuote = async (url) => {
   let data = await fetch(url);
   let json = await data.json();
   let quote = await json.quotes[Math.floor( Math.random()* json.quotes.length -1 )];
   //console.log(quote);
   return quote;
}

let getElements = async () => {
   let quote = await getQuote(URL);
   let text = await quote.quote;
   let author = await quote.author;
   let img = await quote.img;
   document.getElementById('img').src = img;
   document.getElementById('text').innerHTML = text;
   document.getElementById('footer').innerHTML = author;

   console.log({'text':text, 'authour':author, 'img':img});
}


getElements();
