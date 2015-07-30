var NumberKey = require('./NumberKey');
var Position = require('famous/components/Position')
var DOMElement = require('famous/dom-renderables/DOMElement');

function NumberPad(node){
    
    this.mainNumberNode = node

    var numSize = 75;
    var padding = 10;
    var columns = 3;
    var numbers = [
    [1,''],
    [2,'ABC'],
    [3,'DEF'],
    [4,'GHI'], //split
    [5,'JKL'],
    [6,'MNO'],
    [7,'PQRS'], //split
    [8,'TUV'],
    [9,'WXYZ'],
    [0,''] //bottom center
    ]
    
    this.numberNodes = {};
    var len = numbers.length

    var padDimensions = layoutPad(numSize, padding, columns, len)
    
    this.mainNumberNode
        .setSizeMode(1,1,1)
        .setAbsoluteSize(padDimensions[0],padDimensions[1])
        .setAlign(0.5,0.5)
        .setMountPoint(0.5,0.5)
    

    for (var i = 0; i < len; i++){
        var numNode = this.mainNumberNode.addChild()
        
        var numKey = new NumberKey(numNode, {
            number: numbers[i][0],
            text: numbers[i][1],
            btnSize: 75
        })

        var xyz = createPosition(i, padding, columns, numSize)
    
        var pos = new Position(numNode).set(xyz[0],xyz[1])

        this.numberNodes[i] = {
            node: numNode,
            numKey: numKey,
            position: pos
        }


    }


}

function createPosition(index, padding, columns, numSize){

    var xPosition = padding + (index%columns) * (numSize + (padding))
    var yPosition = padding + (Math.floor(index / columns))* (padding+numSize) 
    
    if(index===9){
        xPosition = padding + (1) * (numSize + (padding))

    }

    return [xPosition, yPosition, 0]
}

function layoutPad(numSize, padding, columns, len){
   var width = padding + (numSize + padding) * columns
   var height = padding + (Math.ceil(len/ columns))*(padding+numSize)
   
   return [width, height]
}


module.exports = NumberPad;