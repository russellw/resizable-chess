"use strict"
Object.assign(global, require("../lib"))


let board=initialBoard(8,8)
for(let depth=1;depth<=5;depth++)
{
		const start=Date.now()
movesVals(board,depth)
		const t=Date.now()-start
		console.log(`${depth}\t${t/1000}`)
}
