var NumberKey = require('./NumberKey');
var Position = require('famous/components/Position')
var DOMElement = require('famous/dom-renderables/DOMElement');
var Dot = require('./Dot');
var Transitionable = require('famous/transitions/Transitionable');
var FamousEngine = require('famous/core/FamousEngine');
var iconData = require('./iconData')
var Icons = require('./Icons')

var isMobile = (function() { 
    return ('ontouchstart' in document.documentElement); 
})();
var eventTypeStart = (isMobile) ? 'touchstart' : 'mousedown';
var eventTypeEnd = (isMobile) ? 'touchend' : 'mouseup';





function NumberPad(node){
    
    this.numberPadNode = node;
    this.numberPadNode.eventTypeStart = eventTypeStart;
    this.numberPadNode.eventTypeEnd = eventTypeEnd;
    //initial states
    var numSize = 75;
    var padding = 15;
    var columns = 3;
    var numbers = [
    [1,isMobile],
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
    createIcons.call(this)

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
            // console.log(e)
            if(payload.node !== this.cancelOrDeleteNode && payload.node !== this.emergencyNode) {
                if(e===eventTypeStart){
                    this.markTheDot()
                }
            }
     
            if(payload.node === this.emergencyNode){
                alert('MayDay!')
            }

        }.bind(this)
    });

    // this.gesture = new GestureHandler()
   
}



NumberPad.prototype.markTheDot = function() {
    var index = this.dotsCounter;
    var dotsHash = this.numberPadNode.dots;

    if(dotsHash[index]){
        dotsHash[index].instance.on();
        changeCancelToRemove.call(this)
    }

    if(index === 3){
        FamousEngine.getClock().setTimeout(function(){
            
            this.icons.animateForward()
            removeChildren.call(this)
            //changeToIcons.call(this)
        }.bind(this), 300);
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

function removeChildren(){
    this.cancelOrDeleteNode.setOpacity(0)
    this.cancelOrDeleteNode.setOpacity(0)
    this.numberPadTextNode.setOpacity(0)
    this.emergencyNode.setOpacity(0)
    this.numberPadNode.dots.setOpacity(0)
    
    // this.numberPadNode.removeChild(this.cancelOrDeleteNode)
    // this.numberPadNode.removeChild(this.numberPadTextNode)
    // this.numberPadNode.removeChild(this.emergencyNode)
    // this.numberPadNode.removeChild(this.numberPadNode.dots)
    for (var i = 0; i < 10; i++) {
        this.numberNodes[i].node.setOpacity(0)
       // this.numberPadNode.removeChild(this.numberNodes[i].node)
    };


    this.numberPadNode.removeChild(this.cancelOrDeleteNode)
    this.numberPadNode.removeChild(this.numberPadTextNode)
    this.numberPadNode.removeChild(this.emergencyNode)
    this.numberPadNode.removeChild(this.numberPadNode.dots)
    for (var i = 0; i < 10; i++) {
       // this.numberNodes[i].node.setOpacity(0)
       this.numberPadNode.removeChild(this.numberNodes[i].node)
    };
}


function createIcons(){
    this.icons = new Icons(this.numberPadNode, iconData)
}

// function changeToIcons(){
//     var numSize = 50;
//     var padding = 20;
//     var columns = 4;
//     var vert = 20;
//     var len = 10
//     //todo: fix this
//     //flag to remove centered 9 
//     this.icons = true;

//     for (var i = 0; i < 10; i++) {
//         this.numberNodes[i].node.setOpacity(0)
//         var xyz = iconPositions(i, padding, columns, numSize, 2000, vert, len)
//         this.numberNodes[i].position.set(xyz[0],xyz[1],xyz[2])
//         this.numberNodes[i].numKey.numberKeyNode.setAbsoluteSize(numSize, numSize)
//         this.numberNodes[i].numKey.changeToIcon({})
//         this.numberNodes[i].node.setOpacity(1)
//         this.numberNodes[i].position.set(xyz[0],xyz[1],0,{ duration:4000, curve: 'easeIn' })

//     }

//     var newPadSize = layoutPad(numSize, padding, columns, len);
//     this.numberPadNode.setAbsoluteSize(newPadSize[0],newPadSize[1])
//         .setAlign(-1.5,0.05)
//         .setMountPoint(0.5,0)
    
//      // this.numberPadNode.removeChild(this.cancelOrDeleteNode)
//      // this.numberPadNode.removeChild(this.numberPadTextNode)
//      // this.numberPadNode.removeChild(this.emergencyNode)
    
//     console.log(this.numberPadNode.getAlign())

// }

// function iconPositions(index, padding, columns, btnSizes, initZ, vert, len){
//      var xPosition = padding + (index%columns) * (btnSizes + (padding))
//      var yPosition = padding + (Math.floor(index / columns))* (vert+btnSizes) 
//      var zPosition;
//      if(index%columns===columns-1||index%columns===0){
//         zPosition = initZ*400
//      }
//      if(index%columns < columns-1 && index%columns > 0){
//         zPosition = initZ*150
//         if(Math.ceil(index / columns)===1||Math.ceil(index / columns)===Math.ceil(len.length/columns)){
//           zPosition += initZ*150
//         }
//      }
              
//     return [xPosition, yPosition, zPosition]
// }


module.exports = NumberPad;