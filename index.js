const http = require('http')
const fs = require('fs')
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate')

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true)
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'})
        res.end(output)
    }
    else if(pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id]
        const productDetails = replaceTemplate(tempProduct, product)
        res.end(productDetails)
    }
    else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)
    }
    else{
        res.writeHead(404)
        res.end('Page does not exist')
    }
})

server.listen(8000, (err) => {
    console.log("Listening on port 8000....")
})