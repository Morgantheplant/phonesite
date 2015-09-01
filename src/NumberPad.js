'use strict';
var Position = require('famous/components/Position');
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var Dot = require('./Dot');
var NumberKey = require('./NumberKey');
var iconData = require('./iconData');
var Icons = require('./Icons');

var isMobile = (function() { 
    var isMobile = false
    if('ontouchstart' in document.documentElement){
       // mouse events will override touch events unless  
       var UAstring =  window.navigator.userAgent.toLowerCase();
       isMobile = searchUAStringForSelectMobileDevices(UAstring);
       // prevents swipe action from activating the back button 
       window.history.replaceState(null, null)
    }
    
    return isMobile; 
})();

function searchUAStringForSelectMobileDevices(UA){
   return (UA.indexOf('mobile')!==-1||UA.indexOf('iphone')!==-1||UA.indexOf('android')!==-1||UA.indexOf('ipad')!==-1)
}


var eventTypeStart = (isMobile) ? 'touchstart' : 'mousedown';
var eventTypeEnd = (isMobile) ? 'touchend' : 'mouseup';


function NumberPad(node){
    
    this.numberPadNode = node;
    this.numberPadNode.eventTypeStart = eventTypeStart;
    this.numberPadNode.eventTypeEnd = eventTypeEnd;


    
    var numSize = 75;
    var padding = 15;
    var columns = 3;
    var numbers = [
    [1,''],
    [2,'ABC'],
    [3,'DEF'],
    [4,'GHI'], 
    [5,'JKL'],
    [6,'MNO'],
    [7,'PQRS'], 
    [8,'TUV'],
    [9,'WXYZ'],
    [0,''] 
    ];
    
    this.numberNodes = {};
    var len = numbers.length;

    var padDimensions = layoutPad(numSize, padding, columns, len);
    
    this.numberPadNode
        .setSizeMode(1,1,1)
        .setAbsoluteSize(padDimensions[0],padDimensions[1])
        .setAlign(0.5,0.5)
        .setMountPoint(0.5,0.5);
    

    for (var i = 0; i < len; i++){
        var numNode = this.numberPadNode.addChild();
        
        var numKey = new NumberKey(numNode, {
            number: numbers[i][0],
            text: numbers[i][1],
            btnSize: 75
        });

        var xyz = createPosition.call(this, i, padding, columns, numSize);
    
        var pos = new Position(numNode).set(xyz[0],xyz[1]);

        this.numberNodes[i] = {
            node: numNode,
            numKey: numKey,
            position: pos
        };


    }

    createDots.call(this);
    createText.call(this);
    createEvents.call(this);
    createIcons.call(this);

}

//todo: fix this sloppy function

function createPosition(index, padding, columns, numSize, vertPadding){
    var xPosition = padding + (index%columns) * (numSize + (padding));
    var yPosition = padding + (Math.floor(index / columns))* (padding+numSize); 
    
    if(index===9 && !this.icons){
        xPosition = padding + (1) * (numSize + (padding));

    }

    return [xPosition, yPosition, 0];
}

//todo: fix this sloppy function
function layoutPad(numSize, padding, columns, len){
   var width = padding + (numSize + padding) * columns;
   var height = padding + (Math.ceil(len/ columns))*(padding+numSize);
   return [width, height];
}

function createDots(){
    // Node that postions the Dots as a unit
    this.numberPadNode.dots = this.numberPadNode.addChild()
        .setAlign(0.5,0)
        .setPosition(0,-35,1)
        .setMountPoint(0.5,0)
        .setSizeMode(1,1,1)
        .setAbsoluteSize(108,10);

    var dots = this.numberPadNode.dots;
    this.dotsNumber = 4;
    this.dotsCounter = 0;
    //build and position the dots
    for (var i = 0; i < this.dotsNumber; i++){
        
        var dotsPadding = 20;
        var dotsSize = [12,12];

        dots[i] = dots.addChild();
        dots[i].setPosition((i*dotsSize[0])+(i*dotsPadding),0,0);
        
        dots[i].instance = new Dot(dots[i], {
            size: dotsSize,
            color: 'rgba(200, 191, 217, .7)'
        });
    }
}



function createEvents(){
    this.numberPadNode.addComponent({
        onReceive: function(e, payload) {
            if(payload.node !== this.cancelOrDeleteNode && payload.node !== this.emergencyNode) {
                if(e===this.numberPadNode.eventTypeStart){
                    this.markTheDot();
                }
            }
     
            if(payload.node === this.emergencyNode){
                alert('MayDay!');
            }

        }.bind(this)
    });

    // this.gesture = new GestureHandler()
   
}

NumberPad.prototype.storeSizes = function(x,y){
    this.screenSizes = [x,y];
    this.icons.storeSizes(x,y);
};

NumberPad.prototype.showIcons = function(){
   this.icons.showIcons();

};

NumberPad.prototype.markTheDot = function() {
    var index = this.dotsCounter;
    var dotsHash = this.numberPadNode.dots;

    if(dotsHash[index]){
        dotsHash[index].instance.on();
        changeCancelToRemove.call(this);
    }

    if(index === 3){
        FamousEngine.getClock().setTimeout(function(){
            
            this.icons.animateForward();
            removeChildren.call(this);
            this.removeBlurryBackground();
            //changeToIcons.call(this)
        }.bind(this), 300);
    }
    
    this.dotsCounter++;
};

NumberPad.prototype.removeTheDot = function() {
    if(this.dotsCounter>0){
        this.dotsCounter--;
    }
    var index = this.dotsCounter;
    var dotsHash = this.numberPadNode.dots;
  
    if(dotsHash[index]){
        dotsHash[index].instance.off();
    }

    if(index===0){
        changeRemoveToCancel.call(this);
    }

};

NumberPad.prototype.removeBlurryBackground = function() {
    this.mainBG.opacity.set(0,{duration:1000, curve:'easeOut'}, function(){
        this.mainBG.getParent().removeChild(this.mainBG);
    }.bind(this));
};

function createText(){
    var padding = 10;

    this.numberPadTextNode = this.numberPadNode.addChild()
        .setPosition(0,-70,0)
        .setAlign(0.5,0)
        .setMountPoint(0.5,0)
        .setSizeMode(1,1,1)
        .setAbsoluteSize(176,12);

    new DOMElement(this.numberPadTextNode, {
        content: 'Enter any Four Numbers',
        properties:{
            color: 'white'
        }
    });

    this.emergencyNode = this.numberPadNode.addChild()
        .setPosition(padding,55,0)
        .setAlign(0,1)
        .setSizeMode(1,1,1)
        .setAbsoluteSize(80,12);

    

    this.emergencyNode.addUIEvent('mousedown');
    this.emergencyNode.addUIEvent('touchstart');

    new DOMElement(this.emergencyNode, {
        content: 'Emergency',
        properties:{
            color: 'white',
            cursor: 'pointer'
        }
    });

    this.cancelOrDeleteNode = this.numberPadNode.addChild()
        .setPosition(-padding,55,0)
        .setAlign(1,1)
        .setMountPoint(1,0)
        .setSizeMode(1,1,1)
        .setAbsoluteSize(50,12);

    this.cancelOrDeleteNode.cancel = true;

    this.cancelOrDeleteNode.el = new DOMElement(this.cancelOrDeleteNode, {
        content: 'Cancel',
        properties:{
            color: 'white',
            cursor: 'pointer'
        }
    });

    this.cancelOrDeleteNode.addUIEvent('mousedown');
    this.cancelOrDeleteNode.addUIEvent('touchstart');

}

function changeCancelToRemove(){
    this.cancelOrDeleteNode.cancel = false;
    this.cancelOrDeleteNode.remove = true;
    this.cancelOrDeleteNode.setAbsoluteSize('60');
    this.cancelOrDeleteNode.el.setContent('Remove');
}

function changeRemoveToCancel(){
    this.cancelOrDeleteNode.cancel = true;
    this.cancelOrDeleteNode.remove = false;
    this.cancelOrDeleteNode.setAbsoluteSize('50');
    this.cancelOrDeleteNode.el.setContent('Cancel');
}

function removeChildren(){
    this.cancelOrDeleteNode.setOpacity(0);
    this.cancelOrDeleteNode.setOpacity(0);
    this.numberPadTextNode.setOpacity(0);
    this.emergencyNode.setOpacity(0);
    this.numberPadNode.dots.setOpacity(0);

    for (var i = 0; i < 10; i++) {
        this.numberNodes[i].node.setOpacity(0);
    }


    this.numberPadNode.removeChild(this.cancelOrDeleteNode);
    this.numberPadNode.removeChild(this.numberPadTextNode);
    this.numberPadNode.removeChild(this.emergencyNode);
    this.numberPadNode.removeChild(this.numberPadNode.dots);
    for (var j = 0; j < 10; j++) {
       this.numberPadNode.removeChild(this.numberNodes[j].node);
    }
}


function createIcons(){
    this.icons = new Icons(this.numberPadNode, iconData);
}

module.exports = NumberPad;
