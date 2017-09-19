/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config){
	config.title = false;
	config.magicline_tabuList = ['id'];
	config.extraPlugins = 'tabSwitcher';
	config.format_tags = 'p;h1;h2;h3;h4;h5;h6';
	config.allowedContent = 'h1 h2 h3 h4 h5 h6 span strong em ol ul li hr blockquote table thead tbody tfoot tr th td; a[!href,target]; p(*); iframe[!src,width,height,allowtransparency,allowfullscreen]';
};