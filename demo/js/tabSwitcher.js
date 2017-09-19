/*
	Copyright (c) 2017-08-16 Jake Nicholson
*/
var g_SwitchHappening = false;

function CKTabSwitcher(ClassName){
	var TabSwitcher, TabSwitchers, Tabs, i, Divs;
	TabSwitcher = document.getElementsByClassName(ClassName);
	TabSwitchers = TabSwitcher.length;
	while(!!TabSwitchers){
		TabSwitchers -= 1;
		Tabs = TabSwitcher[TabSwitchers].children[0].children;
		Divs = TabSwitcher[TabSwitchers].children[1].children;
		i = Tabs.length;
		while(!!i){
			i -= 1;
			if(!i){
				Divs[i].style.display = 'block';
				Tabs[i].className = 'active';
			} else {
				Divs[i].style.display = 'none';
				Tabs[i].className = '';
			}
			Tabs[i].addEventListener('click', TSDoSwitch);
			Tabs[i].addEventListener('tap', TSDoSwitch);
		}
	}
}

function TSDoSwitch(event){
	event.preventDefault();
	event.stopImmediatePropagation();
	if(!g_SwitchHappening){
		g_SwitchHappening = true;
		var Tabs, Divs, sID, i, ActiveDiv;
		Tabs = event.target.parentNode.children;
		Divs = event.target.parentNode.nextElementSibling.children;
		sID = event.target.href.split('#')[1];
		
		i = Tabs.length;
		while(!!i){
			i -= 1;
			Tabs[i].className = '';
			Divs[i].style.display = 'none';
		}
		
		event.target.className = 'active';
		ActiveDiv = document.getElementById(sID);
		ActiveDiv.style.display = 'block';
		TSAnimateHeight(ActiveDiv.parentNode, ActiveDiv.clientHeight, 200);
	}
}

function TSAnimateHeight(Element, HeightTo, Duration, HeightFrom, Started){
	
	HeightFrom = typeof(HeightFrom) === 'undefined' ? parseFloat(Element.style.height) : HeightFrom;
	if(isNaN(HeightFrom)){
		HeightFrom = Element.clientHeight;
	}
	
	if(HeightFrom === HeightTo){
		g_SwitchHappening = false;
		return;
	}
	
	var CurrentDate, Elapsed;
	CurrentDate = Date.now();
	Started = typeof(Started) === 'undefined' ? CurrentDate : Started;
	Elapsed = CurrentDate - Started;
	
	Element.style.height = (HeightFrom + (Math.min(Elapsed / Duration, 1) * (HeightTo - HeightFrom))) + 'px';
	
	if(Elapsed >= Duration){
		g_SwitchHappening = false;
	} else {
		setTimeout(function(){
			TSAnimateHeight(Element, HeightTo, Duration, HeightFrom, Started);
		}, 1000/64);
	}
}

/*
	Add a getElementsByClassName function if the browser doesn't have one
	Limitation: only works with one class name
	Copyright: Eike Send http://eike.se/nd
	License: MIT License
	
	Modified 2017-08-16 by Jake Nicholson
	(Added missing semicolon, some stylistic changes)
*/

if(!document.getElementsByClassName){
	document.getElementsByClassName = function(search){
		var d = document, elements, pattern, i, results = [];
		if(d.querySelectorAll){/* IE8 */
			return d.querySelectorAll("." + search);
		}
		if(d.evaluate){/* IE6, IE7 */
			pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
			elements = d.evaluate(pattern, d, null, 0, null);
			while((i = elements.iterateNext())){
				results.push(i);
			}
		} else {
			elements = d.getElementsByTagName("*");
			pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
			i = 0;
			var iMax = elements.length;
			while(i < iMax){
				if(pattern.test(elements[i].className)){
					results.push(elements[i]);
				}
				i += 1;
			}
		}
		return results;
	};
}
