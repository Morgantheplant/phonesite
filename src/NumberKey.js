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
    this.passwordDotsCounter = 0;

    // scene
    this.numberKeyNode = node
    this.elementNode = this.numberKeyNode.addChild();
    
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
    
    this.bg = new DOMElement(this.numberKeyNode,{
        properties: {
            color: 'red',
            borderRadius: '50%',
            border: '3px solid rgba(200, 191, 217, .7)',
            textAlign:'center',
            cursor:'pointer'
        }
    })

    this.numberKeyNode.addUIEvent('touchstart');
    this.numberKeyNode.addUIEvent('mousedown');
    this.numberKeyNode.addUIEvent('touchend');
    this.numberKeyNode.addUIEvent('mouseup');
    this.numberKeyNode.addUIEvent('mouseleave');
    
    this.bgOpacity = new Transitionable(.9)

    var buttonFade = {
        onReceive: function(e){
            
            if(e==='touchstart'||e==='mousedown'){
                this.markTheDot()
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
            if(op){
                this.bg.setProperty('background-color','rgba(200, 191, 217, '+op+')' )
                FamousEngine.requestUpdateOnNextTick(buttonFade)
            }
            
        }.bind(this)
    }

    this.numberKeyNode.addComponent(buttonFade)

}

var counter = 0;

NumberKey.prototype.markTheDot = function(){
    //this.passwordDotsCounter++
   // var index = 4 - this.passwordDotsCounter--;

    var index = counter;
    var dotsHash = this.numberKeyNode.getParent().dots;
    if(dotsHash[index]){
        dotsHash[index].instance.on();
    }
    if(counter === 4){
        //this.numberKeyNode.getParent().triggerIcons()
    }

    counter++


}


function _layoutElements(btnSize){
    
    this.numberKeyNode
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