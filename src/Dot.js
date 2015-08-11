'use strict';
var DOMElement = require('famous/dom-renderables/DOMElement');

function Dot(node, options){ 
    var size = options.size || [10,10];
    this.color = options.color || 'white';

    node.setSizeMode(1,1,1)
        .setAbsoluteSize(size[0],size[1]);

    this.el = new DOMElement(node, {
        properties: {
            borderRadius: '50%',
            color: this.color,
            border: '2px solid'
        }
    });
}

Dot.prototype.on = function(){
    this.el.setProperty('background', 'rgba(200, 191, 217, .9)');
};

Dot.prototype.off = function(){
    this.el.setProperty('background', 'rgba(200, 191, 217, 0)');
};

module.exports = Dot;
