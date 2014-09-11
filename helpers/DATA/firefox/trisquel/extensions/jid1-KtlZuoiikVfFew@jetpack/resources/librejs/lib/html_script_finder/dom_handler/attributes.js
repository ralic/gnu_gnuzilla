/**
 * GNU LibreJS - A browser add-on to block nonfree nontrivial JavaScript.
 * *
 * Copyright (C) 2011, 2012, 2013, 2014 Loic J. Duros
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see  <http://www.gnu.org/licenses/>.
 *
 */

// object model for script entries.
var scriptObject = require("html_script_finder/dom_handler/script_object");

var scriptProperties = require("html_script_finder/dom_handler/script_properties");

const scriptTypes = scriptProperties.scriptTypes;

const statusTypes = scriptProperties.statusTypes;

var jsInAttrRe = /javascript:/ig;

// the list of all available event attributes
var intrinsecEvents = [
  "onload",
  "onunload",
  "onclick",
  "ondblclick",
  "onmousedown",
  "onmouseup",
  "onmouseover",
  "onmousemove",
  "onmouseout",
  "onfocus",
  "onblur",
  "onkeypress",
  "onkeydown",
  "onkeyup",
  "onsubmit",
  "onreset",
  "onselect",
  "onchange"]; 

exports.jsInAttrRe = jsInAttrRe;
exports.intrinsecEvents = intrinsecEvents;


/**
 *  findJSinAttribute
 * 
 *  Looks for attributes containing 'javascript:'
 * 
 */
exports.findJSinAttribute = function (elem, callback) {
  var i = 0, attrLen = elem.attributes.length;

  var attribPairs = [];

  for (; i < attrLen; i++) {

	  //looping through all attributes in elem to look for "javascript:"
	  attrib = elem.attributes[i];

	  if (attrib.value.match(jsInAttrRe)) {
	    str = attrib.value.replace(jsInAttrRe, '');
	    attribPairs.push({attribute: attrib.name, value: str});
	  }

  }

  if (attribPairs.length > 0) {
	  // contains in attribute javascript.   
	  scriptEntry = scriptObject.Script({'type': scriptTypes.ATTRIBUTE,
 					                             'status': statusTypes.UNCHECKED, 
 					                             'element': elem,
					                             'jsAttributes': attribPairs
					                            });
	  
	  // push back to DOMHandler
	  callback(scriptEntry);

  } else {
	  callback(false);
  }

};

/**
 * findOnJSAttribute.
 * 
 * Look for attributes in on*
 * 
 */
exports.findOnJSAttribute = function (elem, callback) {

  var i = 0, eventsLen = intrinsecEvents.length;

  var attribPairs = [];

  for (; i < eventsLen; i++) {

	  // looping through all on* attributes
	  if (elem.hasAttribute(intrinsecEvents[i])) {

	    attribPairs.push({
            attribute: intrinsecEvents[i],
            value: elem.getAttribute(intrinsecEvents[i])
        });

	  }

  }
  if (attribPairs.length > 0) {

	  console.debug('found an attribute', scriptTypes.ATTRIBUTE);
	  scriptEntry = scriptObject.Script({'type': scriptTypes.ATTRIBUTE,
 					                             'status': statusTypes.UNCHECKED,
 					                             'element':elem, 
					                             'jsAttributes': attribPairs
					                            });
	  // Push back to DOMHandler.
	  // push back to DOMHandler
	  callback(scriptEntry);

  } else {
	  callback(false);
  }
};
