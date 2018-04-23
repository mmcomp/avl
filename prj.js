function convertCords(inp){
// 	let out = String(parseFloat(inp)/100);
	let degree = parseInt(parseFloat(inp)/100,10);
	let minute = parseFloat(inp)-(degree*100);
	let out = String(degree+(minute/60));
	return out;
}
console.log(convertCords('3620.5226'));