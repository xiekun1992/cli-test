'use strict';

var fs = require('fs');
var color = require('colors');

var notCreate=['bin','node_modules','app.js'];

var checkProgramFolder=(src,dest)=>{
	fs.exists(dest,(exist)=>{
		if(exist){
			console.log('folder has already existed.'.red);
		}else{
			src = src || __dirname;
			fs.mkdirSync(dest);
			copy(src,dest);
		}
	});
};

var copy=(src, dest)=>{
	fs.readdir(src,(err,files)=>{
		if(err){
			throw err;
		}
		let readable,writable,destPath,srcPath;
		for(let e of files){
			if(notCreate.indexOf(e)===-1){
				destPath=dest+'\\'+e;
				srcPath=src+'\\'+e;
				let stats=fs.statSync(srcPath);
				if(stats.isFile()){
					if(e=='package.json'){
						let contents=fs.readFileSync(srcPath,'utf8');
						contents=JSON.parse(contents);
						for(let obj in contents){
							if(obj.indexOf("_")===0){
								delete contents[obj];
							}
						}
						fs.writeFileSync(destPath,JSON.stringify(contents,null,4));
					}else{
						readable=fs.createReadStream(srcPath);
						writable=fs.createWriteStream(destPath);
						readable.pipe(writable);
					}
				}else if(stats.isDirectory()){
					fs.mkdirSync(destPath);
					copy(srcPath,destPath);						
				}
			}
		}
	});	
}



var printVersion=()=>{
	let filePath=__dirname+'\\package.json';
	let data=fs.readFileSync(filePath);
	data=JSON.parse(data);
	console.log(`${data.version}`);
};

module.exports={
	checkProgramFolder,
	printVersion
};