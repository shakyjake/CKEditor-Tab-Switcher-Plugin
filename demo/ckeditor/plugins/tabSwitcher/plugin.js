/*
	Copyright (c) 2017-08-16 Jake Nicholson
*/
CKEDITOR.plugins.add('tabSwitcher',{
    icons: 'tabswitcher',
    init: function(editor){
		
		editor.ui.addButton('tabSwitcher',{
			label: 'Tab Switcher',
			command: 'insertTabSwitcher',
			toolbar: 'insert,100'
		});
		
		var PluginPath = this.path;
		
		editor.addContentsCss(PluginPath + 'styles/tabswitcher.css');
		
		editor.filter.allow('div(tabSwitcher,tabs,toSwitch)[id]', 'tabSwitcher', true);
		
		editor.addCommand('insertTabSwitcher', new CKEDITOR.dialogCommand('tabSwitcherDialog', {
			requiredContent : 'div(tabSwitcher,tabs,toSwitch)[id]'
		}));
		
		CKEDITOR.dialog.add('tabSwitcherDialog', PluginPath + 'dialogs/dialog.js');
		
		editor.on('mode', function(event){/* switching mode removes event bindings (cheers CK), this also triggers binding on initialisation */
			if(editor.mode.toLowerCase() === 'wysiwyg'){
				BindAndRender(event.editor);
			}
		});
		/*
			CK only implements the change event on a global (editor-wide) basis and have taken a spray-and-pray approach toward firing the event (they say this is "due to performance reasons", which is a Very Good Joke).
			
			They go on to say that you should compare the editor contents on every change event so that the change event isn't fired too often and that it is essential that you do not do this.
			
			I guess what I'm trying to say here is that the CK team should be shot out of a cannon into a black hole, at which point I'll probably make some sort of event horizon joke (astrophysical, not Lawrence-Fishburneical).
		*/
		editor.on('change', function(event){
			TidyUp(event.editor);
		});
		
    }
});

function GetTSIDs(editor){
	var EditorData, IDs;
	EditorData = editor.getData();/* Can't get elements by class name (cheers CK) so we need hacky nonsense */
	IDs = EditorData.match(/tabSwitcher_[\d]{1,5}/);
	if(IDs === null){
		IDs = [];
	}
	return IDs;
}

function TidyUp(editor){
	var IDs, i, TS;
	IDs = GetTSIDs(editor);
	i = IDs.length;
	while(!!i){
		i -= 1;
		TS = editor.document.getById(IDs[i]);
		
		if(TS.getChildCount() < 2){
			TS.remove();
			return;
		}
		
		var Tabs, Divs, ii;
		Tabs = TS.getChild(0);
		Divs = TS.getChild(1);
		
		while(!!ii){
			ii -= 1;
			if(!Tabs.getChild(ii).is('a')){/* Not an anchor. Get Rid. */
				Tabs.getChild(ii).remove();
			} else {
				var MatchedDiv;
				MatchedDiv = editor.document.getById(Tabs.getChild(ii).$.href.split('#')[1]);
				if(!MatchedDiv){/* There's no corresponding div for this tab. Get Rid. */
					Tabs.getChild(ii).remove();
				}
			}
		}
		
		ii = Tabs.getChildCount();
		if(ii !== Tabs.InitialTabCount){
			ii = Divs.getChildCount();
			while(!!ii){
				ii -= 1;
				var iii, NoMatch;
				iii = Tabs.getChildCount();
				NoMatch = true;
				while(!!iii && NoMatch){/* We're deep in loop country now */
					iii -= 1;
					if(Tabs.getChild(iii).$.nodeName.toUpperCase() === 'BR'){
						/* oh fuck off, firefox */
					} else if(Tabs.getChild(iii).$.href.split('#')[1] === Divs.getChild(ii).getId()){
						NoMatch = false;
					}
					if(!iii && NoMatch){/* There's no corresponding tab for this div. Get Rid. */
						Divs.getChild(ii).remove();
					}
				}
			}
		}
		
		ii = Tabs.getChildCount();
		if(!ii){
			TS.remove();
			return;
		}
		ii = Divs.getChildCount();
		if(!ii){
			TS.remove();
			return;
		}
	}
	
}

function BindAndRender(editor){

	var IDs, i, TS;
	IDs = GetTSIDs(editor);
	i = IDs.length;
	while(!!i){
		i -= 1;
		TS = editor.document.getById(IDs[i]);
		var Tabs, Divs, ii;
		
		if(TS.getChildCount() < 2){
			TS.remove();
			return;
		}
		
		Tabs = TS.getChild(0);
		Divs = TS.getChild(1);
		while(!!ii){
			ii -= 1;
			if(!Tabs.getChild(ii).is('a')){/* Not an anchor. Get Rid. */
				Tabs.getChild(ii).remove();
			} else {
				var MatchedDiv;
				MatchedDiv = editor.document.getById(Tabs.getChild(ii).$.href.split('#')[1]);
				if(!MatchedDiv){/* There's no corresponding div for this tab. Get Rid. */
					Tabs.getChild(ii).remove();
				}
			}
		}
		
		while(!!ii){
			ii -= 1;
			if(!Divs.getChild(ii).is('div')){/* Not a div (magicline sux). Get Rid. */
				Divs.getChild(ii).remove();
			} else {
				var iii, NoMatch;
				iii = Tabs.getChildCount();
				NoMatch = true;
				while(!!iii && NoMatch){/* looplooploop. This would all be avoidable if CK hadn't decided to implement their own feature-lite dom */
					iii -= 1;
					
					if(Tabs.getChild(iii).$.nodeName.toUpperCase() === 'BR'){
						/* oh fuck off, firefox */
					} else if(Tabs.getChild(iii).$.href.split('#')[1] === Divs.getChild(ii).getId()){
						NoMatch = false;
					}
					if(!iii && NoMatch){/* There's no corresponding tab for this div. Get Rid. */
						Divs.getChild(ii).remove();
					}
				}
			}
		}
		
		ii = Divs.getChildCount();
		if(!ii){
			TS.remove();
			return;
		}
		ii = Tabs.getChildCount();
		if(!ii){
			TS.remove();
			return;
		}
		Tabs.InitialTabCount = ii;
		while(!!ii){
			
			ii -= 1;
			
			Tabs.getChild(ii).on('click', function(){
				var _a, sID, ToSwitch, iChild;
				_a = this.$;
				sID = _a.href.split('#')[1];
				ToSwitch = _a.parentNode;
				iChild = ToSwitch.children.length;
				while(!!iChild){
					iChild -= 1;
					ToSwitch.children[iChild].className = '';
				}
				_a.className = 'active';
				ToSwitch = _a.parentNode.nextElementSibling;
				iChild = ToSwitch.children.length;
				while(!!iChild){
					iChild -= 1;
					if(ToSwitch.children[iChild].id === sID){
						ToSwitch.children[iChild].style.display = 'block';
						ToSwitch.children[iChild].innerHTML = ToSwitch.children[iChild].innerHTML.replace(' style="display: none;"', '');
					} else {
						ToSwitch.children[iChild].style.display = 'none';
					}
				}
			});
			
			Divs.getChild(ii).$.style.display = 'none';
			Tabs.getChild(ii).removeAttribute('class');
			
			if(!ii){
				Divs.getChild(ii).$.style.display = 'block';
				Tabs.getChild(ii).setAttribute('class', 'active');
			}
		}
	}
}
