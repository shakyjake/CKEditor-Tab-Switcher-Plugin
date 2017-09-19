CKEDITOR.dialog.add( 'tabswitcherDialog', function( editor ) {
    return {
        title: 'Tab Switcher',
        minWidth: 400,
        minHeight: 200,

        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                   {
						type: 'text',
						id: 'tabcount',
						label: 'Number of Tabs',
						validate: CKEDITOR.dialog.validate.regex(/[0-9]+/, "Please enter the number of tabs" )
					}
                ]
            }
        ],
		onOk: function() {
			
            var dialog = this;
			
			var TabSwitcher, TabHolder, DivHolder, Tab, Div, DivP, CurrentTab, NumberOfTabs, UID;
			
			UID = Math.floor(Math.random() * 100000);
			
			TabSwitcher = editor.document.createElement('div');
			TabSwitcher.setAttribute('id', 'tabswitcher_' + UID);
			TabSwitcher.setAttribute('class', 'tabswitcher');
			
			TabHolder = editor.document.createElement('div');
			TabHolder.setAttribute('class', 'tabs');
			
			DivHolder = editor.document.createElement('div');
			DivHolder.setAttribute('class', 'toSwitch');
			
			NumberOfTabs = parseInt(dialog.getValueOf('tab-basic', 'tabcount'));
			
			CurrentTab = 0;
			
			while(CurrentTab < NumberOfTabs){
				
				CurrentTab += 1;
				
				Tab = editor.document.createElement('a');
				Tab.setAttribute('href', '#Tab_' + CurrentTab + '_' + UID);
				Tab.setText('Tab ' + CurrentTab);
				
				Tab.on('click', function(){
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
						} else {
							ToSwitch.children[iChild].style.display = 'none';
						}
					}
				});
				
				if(CurrentTab === 1){
					Tab.setAttribute('class', 'active');
				}
				
				TabHolder.append(Tab);
				
				Div = editor.document.createElement('div');
				Div.setAttribute('id', 'Tab_' + CurrentTab + '_' + UID);
				
				DivP = editor.document.createElement('p');
				DivP.setText('Tab ' + CurrentTab);
				Div.append(DivP);
				
				if(CurrentTab > 1){
					Div.setAttribute('style', 'display: none');
				}
				
				DivHolder.append(Div);
				
			}
			
			TabSwitcher.append(TabHolder);
			TabSwitcher.append(DivHolder);
            editor.insertElement(TabSwitcher);
        }
    };
});