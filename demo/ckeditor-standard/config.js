/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config){
	
	config.magicline_tabuList = ['id'];/* I strongly recommend adding this. ~Jake */
	config.extraPlugins = 'tabswitcher';

	config.format_tags = 'p;h1;h2;h3;h4;h5;h6';
	
};
