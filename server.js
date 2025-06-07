import http from 'http'
import fs from 'fs'
import path from 'path'
import { URL , fileURLToPath} from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publcDir = path.join(__dirname,'public')

const server = http.createServer((req,res)=>{
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = parsedUrl.pathname;

    if (pathname === '/') pathname = '/index.html';
    else if (!path.extname(pathname)) pathname += '.html';

    const filePath = path.join(publcDir,pathname)

    fs.readFile(filePath , (err,data) => {
        if(err){
            fs.readFile(path.join(publcDir,'404.html') , (err404,data404) => {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(data404);
            })
        }else{
            const ext = path.extname(filePath).slice(1);
            const mimeTypes = {
                html: 'text/html',
                css: 'text/css',
                js: 'application/javascript',
                png: 'image/png',
                jpg: 'image/jpeg',
                svg: 'image/svg+xml',
            };

            res.writeHead(200 , { 'Content-Type': mimeTypes[ext]||'text/html' })
            res.end(data)
        }
    })
})

server.listen(3000 , ()=>{console.log("Server is running at 3000")})