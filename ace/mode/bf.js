ace.define("ace/mode/bf_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/text_highlight_rules", "ace/mode/tex_highlight_rules"], (require, exports, module) => {
	var oop = require("../lib/oop");
	var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
	exports.BFHighlightRules = function() {
		this.$rules = { "start" : [
			{
				token : "comment",
				regex : "[^><\\+\\-.,[\\]#]"
			},
			{
				token: "keyword",
				regex : "[><]"
			},
			{
				token : "string",
				regex : "[.,]"
			},
			{
				token : "constant.language.boolean",
				regex : "[[\\]]"
			},
			{
				token : "entity.name.function",
				regex : "[\\+\\-]"
			}]
		};
	};
	oop.inherits(exports.BFHighlightRules, TextHighlightRules);
});


ace.define("ace/mode/folding/bf_folding",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], (require, exports, module) => {
	"use strict";
	var oop = require("../../lib/oop");
	var BaseFoldMode = require("./fold_mode").FoldMode;
	oop.inherits(exports.FoldMode = function() {}, BaseFoldMode);
	
	(function() {
		this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
		this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
		this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
			let line = session.getLine(row), match;
			if(match = line.match(this.foldingStartMarker)) return this.openingBracketBlock(session, match[1], row, match.index);
			if(match = line.match(this.foldingStopMarker))  return this.closingBracketBlock(session, match[1], row, match.index);
		};
	}).call(exports.FoldMode.prototype);
});


ace.define("ace/mode/bf", ["require", "exports", "module", "ace/range", "ace/lib/oop", "ace/mode/text", "ace/mode/text_highlight_rules", "ace/mode/folding/bf_folding"], (require, exports, module) => {
	"use strict";
	var oop = require("../lib/oop");
	var TextMode = require("./text").Mode;
	var BFHighlightRules = require("./bf_highlight_rules").BFHighlightRules;
	var BFFoldMode = require('./folding/bf_folding').FoldMode;

	exports.Mode = function(){
		this.HighlightRules = BFHighlightRules;
		this.$behaviour = this.$defaultBehaviour;
		this.foldingRules = new BFFoldMode();
	};
	oop.inherits(exports.Mode, TextMode);

	(function() {
		this.$id = "ace/mode/bf";
	}).call(exports.Mode.prototype);
});