/*
*	Expression represents specific structure to generate.
*	Provides context for tokens.
*/
function Expression(){
	return this._constructor.apply(this, arguments)
}

Expression.defaults = {
	context: null, //data context to look up data and functions in. Like gates to the outer world
	maxMultiplier: 99, //max possible multiplier generated by * and +
}

extend(Expression.prototype, {
	_constructor: function(str, options){
		this.tokens = [];//dict of tokens
		this.groups = [];//ordered groups to get access by reference, as usually in regexps

		this.options = extend({}, Expression.defaults, options);

		//define actual context
		this.context = this.options.context || extend({}, I);

		//Handle real RegExps passed
		if (str instanceof RegExp) str = str.source;

		//EscapeSymbols all potentially nested token pointers
		var str = escapeSymbols(str, refBrackets);

		//Analyze branches
		this.tokens.length = 1; //reserve place for root
		str = this.flatten(str);

		//Sort out groups		
		this.orderGroups(str);

		this.tokens[0] = new GroupToken(str, 1, this);

		return this;
	},

	/*
	* Overrides current params
	*/
	setParams: function(newOnes){
		this.options = extend(this.options, newOnes);
		this.context = this.options.context;
	},

	/*
	*	Return string with nested groups removed, replaced with group references.
	*	Start with replacing innermost tokens with references, like {{ a }} → <1>, (b) → <2>
	*/
	groupRE:  /(\((?:\?\:)?[^\(\)]*\))(\?|\*|\+|\{[0-9, ]*\}|)/,
	//dataRE:  /(\{\{[^](?!)*\}\})(\?|\*|\+|\{[0-9, ]*\}|)/, //TODO: ?impossible to catch nested double-jsons
	reversiveDataRE:  /(\?|\*|\+|\}[0-9, ]*\{|)(\}\}(?:[^](?!\{\{))*[^]\{\{)/,
	flatten: function(str){		
		//#ifdef DEV
		var debug = false
		//#endif

		var match;
		var c = 0, limit = 99 //prevent infinite cycle

		//#ifdef DEV
		debug && console.group("flatten: ", str)
		//#endif

		//At first, flatten data tokens
		//It is imposible to make two front braces by JSON, but it is possible to do back-braces
		//That may confuse parsing and it is impossible to catch them. 
		//The trick is to inverse the string, catch data-tokens and reverse it back.		
		//{{ int(int(3)) }}{1, 2}{{ none({a: { b: 234 }}) }}
		//}} )}} 432 :b { :a {(enon {{}2 ,1{}} ))3(tni(tni {{

		//There’s still problem with nested strings, containing shit, like "'}}'"
		//We have to escape all brackets within strings
		//NOTE: we cannot use escapeWithin there (it’d escape plain strings too)
		str = str.replace(stringRE, function(){
			return escapeSymbols(arguments[0], "{}")
		})

		//TODO: remove old-way of escaping data-tokens content
		c = 0;
		str = reverse(str);
		while((match = str.match(this.reversiveDataRE)) !== null && c < limit){
			//#if DEV
			debug && console.group("data:", "'" + reverse(match[2]) + "'", "'" + reverse(match[1]) + "'")
			//#endif				

			var token = new DataToken(unescapeSymbols(reverse(match[2]), "{}"), reverse(match[1]), this);
			str = str.replace(match[0], refBrackets[1] + token.idx + refBrackets[0]);

			//#if DEV
			debug && console.groupEnd();
			//#endif

			c++
		}
		str = reverse(str);

		//Then flatten groups
		c = 0;
		while( (match = str.match(this.groupRE)) !== null  && c < limit){
			//#if DEV
			debug && console.group("group:", "'" + match[1] + "'", "'" + match[2] + "'")
			//#endif				

			var token = new GroupToken(match[1], match[2], this);
			str = str.replace(match[0], refBrackets[0] + token.idx + refBrackets[1]);

			//#if DEV
			debug && console.groupEnd();
			//#endif
			c++;
		}

		//#if DEV
		debug && console.groupEnd();
		//#endif

		return str;
	},

	/*
	*	Calc groups sequence, to use them by reference within expression, like \1, \2 etc
	*/
	groupRefRE: new RegExp("(?:[^\\\\]|^)(" + refBrackets[0] + "([0-9]*)" + refBrackets[1] + ")"),
	orderGroups: function(str){
		var matchGroupRef, c = 0;
		this.groups.length = 1; //start with 1;
		while ((matchGroupRef = str.match(this.groupRefRE)) !== null && c < this.tokens.length){
			var token = this.tokens[~~matchGroupRef[2]];
			if (token instanceof GroupToken && token.groupType === "(") this.groups.push(token);
			str = str.replace(matchGroupRef[1], token.toString(true))
			c++;
		}
	},


	/*
		Gets generated instance based on this expression
	*/
	populate: function(){
		//console.group("populate expression:", this.toString())
		var result = this.tokens[0].populate();
		//console.log("pop type", result)
		//console.groupEnd();
		if (typeof result === "string"){
			return unescapeSymbols(result, refBrackets);
		}
		return result;
	},

	/*
		Returns rendered string, representing initial expression string, optimized if it is possible
	*/
	toString: function(){
		return this.tokens[0].toString()
	},

	toJSON: function(){
		return this.tokens[0].toJSON()
	}

})