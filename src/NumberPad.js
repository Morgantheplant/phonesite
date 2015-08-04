var NumberKey = require('./NumberKey');
var Position = require('famous/components/Position')
var DOMElement = require('famous/dom-renderables/DOMElement');
var Dot = require('./Dot');
var Transitionable = require('famous/transitions/Transitionable');
var FamousEngine = require('famous/core/FamousEngine');

function NumberPad(node){
    
    this.numberPadNode = node;
    //initial states
    var numSize = 75;
    var padding = 10;
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
    ]
    
    this.numberNodes = {};
    var len = numbers.length

    var padDimensions = layoutPad(numSize, padding, columns, len)
    
    this.numberPadNode
        .setSizeMode(1,1,1)
        .setAbsoluteSize(padDimensions[0],padDimensions[1])
        .setAlign(0.5,0.5)
        .setMountPoint(0.5,0.5)
    

    for (var i = 0; i < len; i++){
        var numNode = this.numberPadNode.addChild()
        
        var numKey = new NumberKey(numNode, {
            number: numbers[i][0],
            text: numbers[i][1],
            btnSize: 75
        })

        var xyz = createPosition.call(this, i, padding, columns, numSize)
    
        var pos = new Position(numNode).set(xyz[0],xyz[1])

        this.numberNodes[i] = {
            node: numNode,
            numKey: numKey,
            position: pos
        }


    }

    createDots.call(this)
    createText.call(this)
    createEvents.call(this)

}

//todo: fix this sloppy function

function createPosition(index, padding, columns, numSize, vertPadding){
    var topPadding = vertPadding || padding;
    var xPosition = padding + (index%columns) * (numSize + (padding))
    var yPosition = padding + (Math.floor(index / columns))* (padding+numSize) 
    
    if(index===9 && !this.icons){
        xPosition = padding + (1) * (numSize + (padding))

    }

    return [xPosition, yPosition, 0]
}

//todo: fix this sloppy function
function layoutPad(numSize, padding, columns, len){
   var width = padding + (numSize + padding) * columns
   var height = padding + (Math.ceil(len/ columns))*(padding+numSize)
   return [width, height]
}

function createDots(){
    // Node that postions the Dots as a unit
    this.numberPadNode.dots = this.numberPadNode.addChild()
        .setAlign(0.5,0)
        .setPosition(0,-35)
        .setMountPoint(0.5,0)
        .setSizeMode(1,1,1)
        .setAbsoluteSize(108,10);

    var dots = this.numberPadNode.dots
    this.dotsNumber = 4;
    this.dotsCounter = 0;
    //build and position the dots
    for (var i = 0; i < this.dotsNumber; i++){
        
        var dotsPadding = 20;
        var dotsSize = [12,12];

        dots[i] = dots.addChild()
        dots[i].setPosition((i*dotsSize[0])+(i*dotsPadding),0,0)
        
        dots[i].instance = new Dot(dots[i], {
            size: dotsSize,
            color: 'rgba(200, 191, 217, .7)'
        })
    }
}

function createEvents(){
    this.numberPadNode.addComponent({
        onReceive: function(e, payload) {
            if(payload.node !== this.cancelOrDeleteNode && payload.node !== this.emergencyNode) {
                if(e==='touchstart'|| e==='mousedown'){
                    this.markTheDot()
                }
            }
     
            if(payload.node === this.emergencyNode){
                alert('MayDay!')
            }

        }.bind(this)
    });
   
}



NumberPad.prototype.markTheDot = function() {
    var index = this.dotsCounter;
    var dotsHash = this.numberPadNode.dots;

    if(dotsHash[index]){
        dotsHash[index].instance.on();
        changeCancelToRemove.call(this)
    }

    if(index === 3){
       changeToIcons.call(this)
    }
    
    this.dotsCounter++;
}

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
        changeRemoveToCancel.call(this)
    }

}

function createText(){
    var padding = 10;

    this.numberPadTextNode = this.numberPadNode.addChild()
        .setPosition(0,-70,-5)
        .setAlign(0.5,0)
        .setMountPoint(0.5,0)
        .setSizeMode(1,1,1)
        .setAbsoluteSize(176,12)

    new DOMElement(this.numberPadTextNode, {
        content: 'Enter any Four Numbers',
        properties:{
            color: 'white'
        }
    })

    this.emergencyNode = this.numberPadNode.addChild()
        .setPosition(padding,55,0)
        .setAlign(0,1)
        .setSizeMode(1,1,1)
        .setAbsoluteSize(80,12)

    

    this.emergencyNode.addUIEvent('mousedown')
    this.emergencyNode.addUIEvent('touchstart')

    new DOMElement(this.emergencyNode, {
        content: 'Emergency',
        properties:{
            color: 'white',
            cursor: 'pointer'
        }
    })

    this.cancelOrDeleteNode = this.numberPadNode.addChild()
        .setPosition(-padding,55,0)
        .setAlign(1,1)
        .setMountPoint(1,0)
        .setSizeMode(1,1,1)
        .setAbsoluteSize(50,12)

    this.cancelOrDeleteNode.cancel = true;

    this.cancelOrDeleteNode.el = new DOMElement(this.cancelOrDeleteNode, {
        content: 'Cancel',
        properties:{
            color: 'white',
            cursor: 'pointer'
        }
    })

    this.cancelOrDeleteNode.addUIEvent('mousedown')
    this.cancelOrDeleteNode.addUIEvent('touchstart')

}

function changeCancelToRemove(){
    this.cancelOrDeleteNode.cancel = false;
    this.cancelOrDeleteNode.remove = true;
    this.cancelOrDeleteNode.setAbsoluteSize('60')
    this.cancelOrDeleteNode.el.setContent('Remove')

}

function changeRemoveToCancel(){
    this.cancelOrDeleteNode.cancel = true;
    this.cancelOrDeleteNode.remove = false;
    this.cancelOrDeleteNode.setAbsoluteSize('50')
    this.cancelOrDeleteNode.el.setContent('Cancel')
}

function changeToIcons(){
    var numSize = 45;
    var padding = 60;
    var columns = 4;
    var vert = 45;
    var len = 10
    //todo: fix this
    //flag to remove centered 9 
    this.icons = true;

    for (var i = 0; i < 10; i++) {
        var xy = createPosition.call(this, i, padding, columns, numSize, vert)
        this.numberNodes[i].numKey.changeToIcon({})
        this.numberNodes[i].position.set(xy[0],xy[1],1000)
       
        // //  console.log(this.numberNodes[i].position.getZ())
        //  FamousEngine.getClock().setTimeout(function(i, xy){
            this.numberNodes[i].position.set(xy[0],xy[1],0,{ duration:1000, curve: 'easeIn' });

         //  console.log('morgan plant')
         // }.bind(this, i, xy), 1000)
         
        
        

    }

    var newPadSize = layoutPad(numSize, padding, columns, len);
    this.numberPadNode.setAbsoluteSize(newPadSize[0],newPadSize[1])
        .setAlign(-1.5,0)
        .setMountPoint(0.5,0)
    
    // this.numberPadNode.removeChild(this.numberPadNode.dots)
     this.numberPadNode.removeChild(this.cancelOrDeleteNode)
     this.numberPadNode.removeChild(this.numberPadTextNode)
     this.numberPadNode.removeChild(this.emergencyNode)
    
    console.log(this.numberPadNode.getAlign())

}


module.exports = NumberPad;