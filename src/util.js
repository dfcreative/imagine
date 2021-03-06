/*
* Everything that has to be before any other code is inited
*/


/**
* @const
*/
var refBrackets = ["⦅", "⦆"], //["<", ">"]
	escaper = "\\",
	unsafeSymbols = "\\{}[]()^?:.+*$,0123456789'\"|trs",
	stringRE = /(?:'[^']*'|"[^"]*")/g,
	dataDelimiter = ["{{", "}}"] //delimiters to split data-chunks from string


/*
	class extender tool
*/
function extend(a){
	for (var i = 1, l = arguments.length; i<l; i++){
		var b = arguments[i];
		for (var k in b){
			a[k] = b[k];
		}
	}
	return a;
}



function none(arg){
	return arg || null
}

/*
*	Returns reversed str
*/
function reverse(str){
	if (typeof str === "string") return str.split('').reverse().join('');
	return str.reverse();
}

/*
*	Returns random value from array/string passed
*/
function any(arr){
	if (!arr) return arr;
	if (arr.length !== undefined) return arr[int(arr.length-1)];
	if (arguments.length > 1) return arguments[int(arguments.length-1)];
	return arr;
}


//RepeatSequence stubs
function index(num){
	console.log("bad index")
	return num;
}
/*function repeat(){
	return undefined
}*/


/*
*	Apply list of replacements to the string, like {"x": "12345", "X": "0123456789"}
*/
function replacements(str, replacements){
	var self = this;
	for (var rep in replacements){
		var re = rep.replace(/[\?\*\+\\\{\}\[\]\(\)\,\.]/, function(m){return "\\" + m});
		str = str.replace(new RegExp(re, "g"), function(){
			return any(replacements[rep])
		})
	}

	return str;
}


//cache of expressions
var expressions = {};

/**
*	Expressions cacher. Retrieves expression from cache, if any, and if there is none - creates one.
*	Also can set a context for expression.
*	"{{ Internet.url }}{2,3}"
*	"[a-z]{4,5}"
*	"([1-9][0-9]?)(?:, ${1}){,2}" ⇒ "14", "5" or "2, 12, 45"
*	""
*	@return {Expression}
*/
function expression(str){
	if (expressions[str]) return expressions[str];

	expressions[str] = new Expression(str);
	return expressions[str];
}

//cache of call sequences
var callSequences = {};
function callSequence(str){
	if (callSequences[str]) return callSequences[str];

	callSequences[str] = new CallSequence(str);
	return callSequences[str];
}




/*
*	Escapes symbols passed
*/
//TODO: think how to escape non-single symbols like \\x123
function escapeSymbols(str, symbols){
	if (symbols instanceof Array) symbols = symbols.join('');
	symbols = symbols.replace(/[\[\]\\]/g, "\\$&");
	return str.replace(new RegExp("[" + symbols + "]", "g"), "\\$&");
}

/*
* Vice-versa action: convert `\n` to `n`
*/
function unescapeSymbols(str, symbols){
	if (symbols instanceof Array) symbols = symbols.join('');
	symbols = symbols.replace(/[\[\]\\]/g, "\\$&");
	return str.replace(new RegExp("\\\\([" + symbols + "])", "g"), "$1");
}

/*
* Transforms all stringy synbols like \t, \s, ... to real chars: tab, space etc.
*/
function unescapeString(str){
	str = str.replace(/\\'/g, "'")
	str = str.replace(/\\"/g, "\"")
	str = str.replace(/\\t/g, "\t")
	str = str.replace(/\\b/g, "\b")
	str = str.replace(/\\n/g, "\n")
	str = str.replace(/\\r/g, "\r")
	str = str.replace(/\\f/g, "\f")
	str = str.replace(/\\([^])/g, "$1");
	return str;
}

/*
* Escapes every occurence of value within symbols, like `escapeWithin(str, "''")`
* E.g. `escapeWithin("a(b(&))", "()")` returns `a(b%28%26%29)`
*
* If multiple limiters passed, escapes all outermost variants found
* e.g. `escapeWithin("{[]}", "[]", "{}")` escapes only once - content within "{}"
*/
function escapeWithin(str){
	return doWithin(str, escape, Array.prototype.slice.apply(arguments).slice(1))
}
function unescapeWithin(str){
	return doWithin(str, unescape, Array.prototype.slice.apply(arguments).slice(1))	
}

/*
* Calls string handler function on the elements within limiters.
* Used by escapeWithin, unescapeWithin 
* limitersList (@ll) is a list of limiters to seek for limiter braces within, like ["{}", "[]", ["{{", "}}"], ...]
*/
function doWithin(str, fn, ll){
	var lCount = 0, //counter of nested limiters
		cutPoint = 0,  //points to escape within
		result = "",
		i = 0,
		curLim = -1,
		llLen = ll.length;

	while (i < str.length){
		//console.group("before:", i, "lCount:" + lCount, "curLim:" + curLim)
		//find outermost limiter from optional limiters passed
		if (curLim < 0){
			for (var j = 0; j < llLen; j++){
				if (str.substr(i, ll[j][0].length) === ll[j][0] && str[i-1] !== "\\") {
					curLim = j;
					break;
				}
			}
		}

		//if insideof some limiter already
		if ( curLim >= 0
			&& str.substr(i, ll[curLim][0].length) === ll[curLim][0] && str[i-1] !== "\\"
			&& (ll[curLim][0] !== ll[curLim][1] || (ll[curLim][0] === ll[curLim][1] && lCount === 0))){
			//find limiter from optional passed, if possible
			if (lCount === 0) {
				result += str.slice(cutPoint, i );
				//console.log("start", cutPoint, i, result)
				cutPoint = i+ll[curLim][0].length;
			}
			i += ll[curLim][0].length;
			lCount++;
		} else if ( curLim >= 0 && lCount > 0 
			&& str.substr(i, ll[curLim][1].length) === ll[curLim][1] && str[i-1] !== "\\"){
			lCount--;
			if (lCount === 0){
				result += ll[curLim][0] + fn(str.slice(cutPoint, i)) + ll[curLim][1];
				//console.log("end", cutPoint, i, result)
				i += ll[curLim][1].length;
				cutPoint = i;
				curLim = -1;
			} else {
				i += ll[curLim][1].length;
			}
		} else {
			i++;
		}
		//console.log("after:", i, "lCount:" + lCount, "curLim:" + curLim)
		//console.groupEnd();
	}

	result += str.slice(cutPoint, str.lenght);

	return result
}



/*
* Determines what the param is: string, data object, sequence, json etc
* Used to be used within datasource, then migrated to globals due to versatility
*/
function recognizeParam(str){
	//console.log("recognize:", str)
	var result = undefined;
	//123.456
	if (!isNaN(result = parseFloat(str))){
		return result;
	}

	//true/false
	else if (/^true$/i.test(str)){
		return true
	}
	else if (/^false$/i.test(str)){
		return false
	}

	//techs
	else if (str === undefined || str.length === 0 || str === "undefined"){
		return undefined
	}
	else if (str === "NaN"){
		return NaN
	}
	else if (str === "null"){
		return null
	}

	//'string'
	else if (/^(?:"(?:[^"]|\\")*"|'(?:[^']|\\')*')$/.test(str)){
		return str.slice(1,-1);
	}

	//['list', 04, 'things']
	else if (str[0] === "[" && str[str.length - 1] === "]"){
		str = str.slice(1,-1).trim();
		if (!str) return [];

		str = escapeWithin(str, "{}", "[]");
		var params = str.split(",");
		var result = [];
		for (var i = 0; i < params.length; i++){
			//console.log("list param:", params[i])
			params[i] = unescape(params[i]).trim();
			result[i] = recognizeParam(params[i]);
		}

		return result;
	}

	//{a: 1, b: 2}
	else if (str[0] === "{" && str[str.length - 1] === "}"){
		str = str.slice(1,-1);
		str = str.trim();

		if (!str) return {};

		str = escapeWithin(str, "{}", "[]", "()", "''", '""');

		var props = str.split(",");

		result = {};
		for (var i = 0; i < props.length; i++){
			props[i] = props[i].trim()
			var propComps = props[i].split(":");
			var key = propComps[0].trim();
			var value = propComps[1].trim();
			if ((key[0] === "'" && key[key.length - 1] === "'") || (key[0] === '"' && key[key.length - 1] === '"')){
				key = key.slice(1, -1);
			}
			value = unescape(value);
			result[key] = recognizeParam(value);
		}

		return result;
	}

	//data.['type'](12, 13).maybe.['with_some']['property'].at.last(1, 'abc', [[1], 2])
	else if (/[a-z_$@]/i.test(str[0])){
		//Then define calling sequence
		return callSequence(str);
	}

	throw new Error("Can not recognize the param `" + str + "`")
	//return null;
}

/*
* Arguments parser returns list of arguments parsed from comma-separated string
* Used to be used within CallSequence, then moved out in favour of versatility
*/
function parseArguments(str){
	//console.log("parse arguments:", str)
	if (str === undefined) return [null];

	str = str.trim();
	str = escapeWithin(str, "[]", "()", "{}", "''", '""')
	var args = str.split(/,[ ]?/);

	var result = [];

	for (var i = 0; i < args.length; i++){
		result.push(recognizeParam(unescape(args[i]).trim()))
	}

	return result;
}