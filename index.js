const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replace-template');

////////////////////////////////////////////
//               FILES                    //
////////////////////////////////////////////

// Blocking, syncrhonous way
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInput);
// const textOutput = `This is what we know about the avocadi ${textInput}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOutput);
// console.log('File has been written');



//Non-Blocking asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (error, data) => {
//     if(error){ return console.log('Error 💥'); }
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (error, data2) => {
//         console.log(data2.toString());
//         fs.readFile('./txt/append.txt', 'utf-8', (error, data3) => {
//             console.log(data3.toString());
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', error => {
//                 console.log('Your file has been written (:');                
//             });
             
//         });
//     });
    
// });

////////////////////////////////////////////
//               SERVER                   //
////////////////////////////////////////////

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const server = http.createServer((req, res) => {
    
    const {query, pathname} = url.parse(req.url, true);
    if(pathname === '/' || pathname === '/overview'){
        const cardsHtml = dataObj.map( el => replaceTemplate(templateCard, el) );
        const overview = templateOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);
        res.writeHead(200, 'Returning html file form server', {'Content-type': 'text/html'});
        res.end(overview);
        
    }else if ( pathname === '/product' ){
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.writeHead(200, 'Returning html file form server', {'Content-type': 'text/html'});
        res.end(output);
    }else if( pathname === '/api' ){
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data)
    }
    else{
        res.writeHead(404, 'Page does not exist in application', {
            'Content-type': 'text/html'
        });
        res.end('<h1>Page not found !</h1>');
    }

});


server.listen(8080, '127.0.0.1', () => {
    console.log('Application is running Listening to requests...');
});