var Position = require('famous/components/Position')
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var Opacity = require('famous/components/Opacity')


function Icons(rootnode, options){
    this.iconsNode = rootnode.addChild()
    this.show = new Opacity(this.iconsNode).set(0)   //.setScale(0,0);


    var len = options.len || 25;
    var numSize = options.numSize || 50;
    var padding = options.padding || 20;
    var columns = options.columns || 4;
    var vert = options.vert || 25;
    var initZ = options.initZ || 2000;
    var borderRadius = options.borderRadius;
    this.colors = options.colors;

    this.iconInfo = []
    
    //size node
    var xy = layoutPad(numSize, padding, columns, len)
    rootnode
        .setAbsoluteSize(xy[0],xy[1])
        .setAlign(-1.5,0.05)
        .setMountPoint(0.5,0)
        

    // new DOMElement(this.iconsNode, {
    //     properties:{
    //         background:'green'
    //     }
    // })

    for (var i = 0; i < 10; i++) {
        var xyz = iconPositions(i, padding, columns, numSize, 1, vert, len)

        var icon = this.iconsNode.addChild()
            .setSizeMode(1,1,1)
            .setAbsoluteSize(numSize, numSize)
        this.iconInfo[i] = new Position(icon)
           .set(xyz[0],xyz[1],xyz[2])
        //var color = options.color[i] || randomColor();
        
        this.iconInfo[i].el = new DOMElement(icon, {
            content: options.content[i],
            classes: ['icon',options.classes[i]||"default"],
            properties: {
                borderRadius: borderRadius
            }
        })
        
        
        //positions.set(xyz[0],xyz[1],0,{ duration:4000, curve: 'easeIn' })

        var iconText = icon.addChild()
            .setSizeMode(1,1,1)
            .setAbsoluteSize(50,10,0)
            .setMountPoint(0.5,1)
            .setAlign(0.5,1)
            .setPosition(0,10,0)

        new DOMElement(iconText, {
            content: options.iconText[i]||"Icon",
            properties:{
                fontSize: '10px',
                color:'white',
                textAlign: 'center'
            }
        })

       
    }

    this.animateForward()
  
}

Icons.prototype.animateForward = function(){
    this.show.set(1)
    var len = this.iconInfo.length
    for (var i = 0; i < len ;i++){
        this.iconInfo[i].setZ(0,{duration:2500, curve:'inOutExpo'})
        var color = this.colors[i]||randomColor()
        this.iconInfo[i].el.setProperty('background', color)
    }
}


function randomColor(){
    return 'rgb('+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+')'
}


function iconPositions(index, padding, columns, btnSizes, initZ, vert, len){
    var xPosition = padding + (index%columns) * (btnSizes + (padding))
    var yPosition = padding + (Math.floor(index / columns))* (vert+btnSizes) 
    var zPosition;
    if(index%columns===columns-1||index%columns===0){
        zPosition = initZ*400
    }
    if(index%columns < columns-1 && index%columns > 0){
        zPosition = initZ*150
        if(Math.ceil(index / columns)===1||Math.ceil(index / columns)===Math.ceil(len.length/columns)){
          zPosition += initZ*150
        }
    }
              
    return [xPosition, yPosition, zPosition]
}

function layoutPad(numSize, padding, columns, len){
   var width = padding + (numSize + padding) * columns
   var height = padding + (Math.ceil(len/ columns))*(padding+numSize)
   return [width, height]
}

module.exports = Icons;