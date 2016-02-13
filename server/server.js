'use strict';

var server = require('http');
var fs = require('fs');
var color = require('colors');


var staticServer=(req,res)=>{
	if(req.method=='GET'){
		let lindex=__dirname.indexOf('\\server');
		let path=__dirname.slice(0,lindex)+'\\client'+req.url.replace(/\//g,'\\');
		responseFile(path,res,req);
	}
};

var responseFile=(path,res,req)=>{
	fs.exists(path,(exist)=>{
		if(exist){
			fs.readFile(path,'utf8',(err,data)=>{
				if(err)throw err;
				let ext=path.split('.').pop();
				let fileData={
					ext,
					data
				};
				judgeExt(fileData,res,req);
			});
		}else{
			res.setHeader('content-type','text/plain');
			res.statusCode=404;
			res.end('Not Found');
			console.log(`${res.statusCode}`.red+` ${req.url}`);
		}
	})
};

var judgeExt=(fileData,res,req)=>{
	let contentType;
	switch(fileData.ext){
		case 'html':contentType='text/html';break;
		case 'css':contentType='text/css';break;
		case 'svg':contentType='image/svg+xml';break;
		default:contentType='text/plain';
	}
	res.setHeader('content-type',contentType);
	res.statusCode=200;
	res.end(fileData.data);
	console.log(`${res.statusCode}`.cyan+` ${req.url}`);
};

server.createServer(staticServer).listen('3000','localhost');

console.log('The static file server has already launched on port 3000 at localhost.'.green);