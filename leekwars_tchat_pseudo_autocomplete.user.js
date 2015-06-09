// ==UserScript==
// @name          [Leek Wars] Tchat Pseudo Autocomplete
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.5
// @description   Ajout de l'autocomplétion pour les pseudos dans le tchat
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_pseudo_autocomplete.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_pseudo_autocomplete.user.js
// @match         http://leekwars.com/*
// @grant         none
// ==/UserScript==

(function()
{

	var autocompleteNames = [];

	function autocompleteChat(_chat)
	{

		var startNamePos = getSelectionStart(_chat);
		var endNamePos = getSelectionStart(_chat)-1;

		if (autocompleteNames.length != 0)
		{
			startNamePos = getSelectionStart(_chat)-1;
			endNamePos = getSelectionStart(_chat)-2;
		}

		while(--startNamePos >= 0)
			if (_chat.val().substr(startNamePos,1) == " ")
				break;

		while(++endNamePos < _chat.val().length)
			if (_chat.val().substr(endNamePos,1) == " ")
				break;

		var currentName = _chat.val().substring(startNamePos + 1, endNamePos);

		if (autocompleteNames.length == 0 && currentName.length > 0)
		{

			for (var lang in LW.chat.messages)
			{
				for (var message in LW.chat.messages[lang])
				{
					var name = LW.chat.messages[lang][message][2];
					if (name.substr(0, currentName.length).toLowerCase() == currentName.toLowerCase() && autocompleteNames.indexOf(name) == -1)
							autocompleteNames.push(name);
				}
			}

			if (autocompleteNames.length > 0)
			{

				var before = _chat.val().substring(0, startNamePos + 1);
				var after = _chat.val().substring(endNamePos);
				currentName = autocompleteNames[autocompleteNames.length-1] + " ";

				_chat.val(before + currentName + after);
				setCursorPosition(_chat, startNamePos + currentName.length + 1);

			}

		}
		else
		{
			var currentPos = autocompleteNames.indexOf(currentName);
			if (currentPos != -1)
			{
				currentPos++;
				if (currentPos > autocompleteNames.length - 1) currentPos = 0;

				var before = _chat.val().substring(0, startNamePos + 1);
				var after = _chat.val().substring(endNamePos + 1);
				currentName = autocompleteNames[currentPos] + " ";

				_chat.val(before + currentName + after);
				setCursorPosition(_chat, startNamePos + currentName.length + 1);
			}
		}

	}

	$(document).on('keydown', '#social-panel .chat-input', function(e)
	{
		if (e.keyCode === 9)
		{
			e.preventDefault();
			autocompleteChat($('#social-panel .chat-input'));
		}
		else
		{
			autocompleteNames = [];
		}
	});

	$(document).on('keydown', '#chat-input', function(e)
	{
		if (e.keyCode === 9)
		{
			e.preventDefault();
			autocompleteChat($('#chat-input'));
		}
		else
		{
			autocompleteNames = [];
		}
	});

	$(document).on('click', '#social-panel .chat-input', function(e)
	{
		autocompleteNames = [];
	});

	$(document).on('click', '#chat-input', function(e)
	{
		autocompleteNames = [];
	});

	function getCursorPosition(_this)
	{
		if (_this.lengh == 0) return -1;
		return getSelectionStart(_this);
	}

	function setCursorPosition(_this, position)
	{
		if (_this.lengh == 0) return this;
		return setSelection(_this, position, position);
	}

	function getSelection(_this)
	{
		if (_this.lengh == 0) return -1;
		var s = getSelectionStart(_this);
		var e = getSelectionEnd(_this);
		return this[0].value.substring(s,e);
	}

	function getSelectionStart(_this)
	{
		if (_this.lengh == 0) return -1;
		input = _this[0];

		var pos = input.value.length;

		if (input.createTextRange)
		{
			var r = document.selection.createRange().duplicate();
			r.moveEnd('character', input.value.length);
			if (r.text == '') 
			pos = input.value.length;
			pos = input.value.lastIndexOf(r.text);
		}
		else if (typeof(input.selectionStart)!="undefined")
			pos = input.selectionStart;

		return pos;
	}

	function getSelectionEnd(_this)
	{
		if (_this.lengh == 0) return -1;
		input = _this[0];

		var pos = input.value.length;

		if (input.createTextRange)
		{
			var r = document.selection.createRange().duplicate();
			r.moveStart('character', -input.value.length);
			if (r.text == '') 
			pos = input.value.length;
			pos = input.value.lastIndexOf(r.text);
		}
		else if(typeof(input.selectionEnd)!="undefined")
			pos = input.selectionEnd;

		return pos;
	}

	function setSelection(_this, selectionStart, selectionEnd)
	{
		if (_this.lengh == 0) return this;
		input = _this[0];

		if (input.createTextRange)
		{
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
		else if (input.setSelectionRange)
		{
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}

		return _this;
	}

})();
