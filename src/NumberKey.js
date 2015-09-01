'use strict';
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var Transitionable = require('famous/transitions/Transitionable');

function NumberKey(node, options){
  
    var btnSize = options.btnSize || 75;
    var bgColor = options.bgColor || 'rgb(215, 206, 232)';
    var number = options.number;
    var text = options.text;
    this.passwordDotsCounter = 0;

    // scene
    this.numberKeyNode = node;
    this.elementNode = this.numberKeyNode.addChild();
    
    //create elements
    _createBgElements.call(this, bgColor);
    _createElement.call(this, number, text);
    
    //position elements
    _layoutElements.call(this, btnSize);

}


function _createElement(number, text){   
    var content = '<span class="number">' + number + '</span><br /><span class="text">'+text+'</span>';
    this.element = new DOMElement(this.elementNode,{
        content: content,
        properties: {
            color:'white',
            fontFamily:"'Arimo',Droid Sans', sans-serif",
            textAlign:'center',
            fontSize:'30px',
            lineHeight:'15px'
        }
        
    });

}

function _createBgElements(bgColor){   
    this.bg = new DOMElement(this.numberKeyNode,{
        properties: {
            color: 'red',
            borderRadius: '50%',
            border: '3px solid rgba(200, 191, 217, .7)',
            textAlign:'center',
            cursor:'pointer'
        }
    });
    
    this.numberKeyNode.addUIEvent('click');
    this.numberKeyNode.addUIEvent('touchstart');
    this.numberKeyNode.addUIEvent('mousedown');
    this.numberKeyNode.addUIEvent('touchend');
    this.numberKeyNode.addUIEvent('mouseup');
    this.numberKeyNode.addUIEvent('mouseleave');
     this.numberKeyNode.addUIEvent('mouseover');
    
    this.bgOpacity = new Transitionable(.9);
    
    var eventTypeStart = this.numberKeyNode.getParent().eventTypeStart;
    var eventTypeEnd = this.numberKeyNode.getParent().eventTypeEnd;

    this.buttonFade = {
        onReceive: function(e){
           
            if(e===eventTypeStart){
                this.bg.setProperty('background-color', 'rgba(200, 191, 217, .9)');
                this.bgOpacity.set(.9);
            }

            if(e===eventTypeEnd){
                this.bgOpacity.set(0, {duration:350});            
                FamousEngine.requestUpdate(this.buttonFade);
            }

        }.bind(this),
        onUpdate: function(){
            var op = this.bgOpacity.get();
            if(op){
                this.bg.setProperty('background-color','rgba(200, 191, 217, '+op+')' );
                FamousEngine.requestUpdateOnNextTick(this.buttonFade);
            }
            
        }.bind(this)
    };

    this.numberKeyNode.addComponent(this.buttonFade);

}



function _layoutElements(btnSize){
    
    this.numberKeyNode
        .setSizeMode(1,1,1)
        .setAbsoluteSize(75, 75);

    this.elementNode
        .setSizeMode(1,1,1)
        .setAbsoluteSize(35,45)
        .setAlign(0.5,0.5)
        .setMountPoint(0.5,0.5)
        .setPosition(-2,2,0);

}

// function randomColor(){
//     return 'rgb('+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+')';
// }

module.exports = NumberKey;
