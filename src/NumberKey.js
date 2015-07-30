var DOMElement = require('famous/dom-renderables/DOMElement');
var Opacity = require('famous/components/Opacity');
var GestureHandler = require('famous/components/GestureHandler');
var FamousEngine = require('famous/core/FamousEngine');
var Transitionable = require('famous/transitions/Transitionable');

function NumberKey(node, options){
  
    var btnSize = options.btnSize || 75;
    var bgColor = options.bgColor || 'rgb(215, 206, 232)';
    var number = options.number;
    var text = options.text;

    // scene
    this.node = node
    this.elementNode = this.node.addChild();
    
    //create elements
    _createBgElements.call(this, bgColor)
    _createElement.call(this, number, text)
    
    //positoin elements
    _layoutElements.call(this, btnSize)


}




function _createElement(number, text){
    
    var text = '<span class="number">' + number + '</span><br /><span class="text">'+text+'</span>'
    this.element = new DOMElement(this.elementNode,{
        content: text,
        properties: {
            color:'white',
            fontFamily:"'Arimo',Droid Sans', sans-serif",
            textAlign:'center',
            fontSize:'30px',
            lineHeight:'15px'
        }
        
    })

}

function _createBgElements(bgColor){
    
    this.bg = new DOMElement(this.node,{
        properties: {
            color: 'red',
            borderRadius: '50%',
            border: '3px solid rgba(200, 191, 217, .7)',
            textAlign:'center',
            cursor:'pointer'
        }
    })

    this.node.addUIEvent('touchstart');
    this.node.addUIEvent('mousedown');
    this.node.addUIEvent('touchend');
    this.node.addUIEvent('mouseup');
    this.node.addUIEvent('mouseleave');
    
    this.bgOpacity = new Transitionable(.9)

    var buttonFade = {
        onReceive: function(e){
            
            if(e==='touchstart'||e==='mousedown'){
               this.bg.setProperty('background-color', 'rgba(200, 191, 217, .9)')
               this.bgOpacity.set(.9)
            }

            if(e==='touchend'||e==='mouseup'){
               this.bgOpacity.set(0, {duration:350})

              FamousEngine.requestUpdate(buttonFade)
            }

        }.bind(this),
        onUpdate: function(){
            var op = this.bgOpacity.get()
            console.log(op)
            if(op){
                this.bg.setProperty('background-color','rgba(200, 191, 217, '+op+')' )
                FamousEngine.requestUpdateOnNextTick(buttonFade)
            }
            
        }.bind(this)
    }

    this.node.addComponent(buttonFade)

}


function _layoutElements(btnSize){
    
    this.node
        .setSizeMode(1,1,1)
        .setAbsoluteSize(75, 75)
        // .setAlign(0.5,0.5)
        // .setMountPoint(0.5,0.5)

    this.elementNode
        .setSizeMode(1,1,1)
        .setAbsoluteSize(35,45)
        .setAlign(0.5,0.5)
        .setMountPoint(0.5,0.5)
        .setPosition(-2,2,0)

}



module.exports = NumberKey;