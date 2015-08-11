'use strict';
var DOMElement = require('famous/dom-renderables/DOMElement');
var Align = require('famous/components/Align');
var Scale = require('famous/components/Scale');
var Position = require('famous/components/Position');

function Icons(rootnode, options){
    this.root = rootnode;
    this.iconsNode = rootnode.addChild();
    this.iconsNode.scale = new Scale(this.iconsNode);
    this.iconsNode.position = new Position(this.iconsNode);
    this.show = new Align(this.iconsNode).setY(-1);
    this.options = options;
    

    var len = options.len || 10;
    var numSize = options.numSize || 50;
    var padding = options.padding || 20;
    var columns = options.columns || 4;
    var vert = options.vert || 30;
    var borderRadius = options.borderRadius;
    this.colors = options.colors;

    this.iconsNode.addComponent({
        onReceive:function(e,p){
           if(e==="click"){
            clickedAnIcon.call(this, p.node.id, columns, len);
           }
        }.bind(this)
    });

    this.iconInfo = [];

    for (var i = 0; i < len; i++) {
        var xyz = iconPositions(i, padding, columns, numSize, 1, vert, len);

        var icon = this.iconsNode.addChild()
            .setSizeMode(1,1,1)
            .setAbsoluteSize(numSize, numSize);
        icon.id = i;
        
        this.iconInfo[i] = new Position(icon)
           .set(xyz[0],xyz[1],xyz[2]);
        
        var content = './images/icons/'+options.classes[i].toLowerCase()+'.png';

        this.iconInfo[i].el = new DOMElement(icon, {
            content: '<img style="height:50px;width:50px" src="'+content+'" />',
            classes: ['icon',options.classes[i]||"default"],
            properties: {
                borderRadius: borderRadius,
                cursor:'pointer'
            }
        });
        
        icon.addUIEvent('click');
        
        //positions.set(xyz[0],xyz[1],0,{ duration:4000, curve: 'easeIn' })

        var iconText = icon.addChild()
            .setSizeMode(1,1,1)
            .setAbsoluteSize(50,10,0)
            .setMountPoint(0.5,1)
            .setAlign(0.5,1)
            .setPosition(0,15,0);

        new DOMElement(iconText, {
            content: options.iconText[i]||"Icon",
            properties:{
                fontSize: '10px',
                color:'white',
                textAlign: 'center'
            }
        });

       
    }

      

   
  
}

Icons.prototype.storeSizes = function(x,y){
    this.screenSizes = [x,y];
};

Icons.prototype.animateForward = function(){
    var options = this.options;
    var xy = layoutPad(options.numSize, options.padding, options.columns, options.len);
    this.root
        .setAbsoluteSize(xy[0],xy[1])
        .setAlign(-1.5,0.05)
        .setMountPoint(0.5,0);
    var len = this.iconInfo.length;
    this.show.setY(0);
    for (var i = 0; i < len ;i++){
        this.iconInfo[i].setZ(0,{duration:1500, curve:'inOutExpo'});
    }
};

Icons.prototype.showIcons = function(){
    this.iconsNode.scale.set(1,1,1, {duration:500, curve:'inOutExpo'});
    this.iconsNode.setPosition(0,0,0);  
};


function iconPositions(index, padding, columns, btnSizes, initZ, vert, len){
    var xPosition = padding + (index%columns) * (btnSizes + (padding));
    var yPosition = padding + (Math.floor(index / columns))* (vert+btnSizes); 
    var zPosition;
    if(index%columns===columns-1||index%columns===0){
        zPosition = initZ*300;
    }
    if(index%columns < columns-1 && index%columns > 0){
        zPosition = initZ*110;
        if(Math.ceil(index / columns)===1||Math.ceil(index / columns)===Math.ceil(len.length/columns)){
          zPosition += initZ*110;
        }
    }
              
    return [xPosition, yPosition, zPosition];
}

function layoutPad(numSize, padding, columns, len){
   var width = padding + (numSize + padding) * columns;
   var height = padding + (Math.ceil(len/ columns))*(padding+numSize);
   return [width, height];
}

function convertRange(OldMin, OldMax, NewMin, NewMax, OldValue){
    var OldRange = (OldMax - OldMin);  
    var NewRange = (NewMax - NewMin);  
    var  NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin;
    return NewValue;
}


function clickedAnIcon(index, columns, len){
    var x = convertRange(0, columns-1, 0, 1, index%columns);
    var rows = Math.ceil(len/columns)-1;
    var y = convertRange(0, rows, 0, 1, Math.floor(index/columns));
    this.iconsNode.setOrigin(x,y);
    this.iconsNode.scale.set(5,5,1, {duration:300, curve:'inOutExpo'});
}


module.exports = Icons;
