var Position = require('famous/components/Position')
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var Align = require('famous/components/Align')
var Scale = require('famous/components/Scale')
var Position = require('famous/components/Position')

function Icons(rootnode, options){
    this.root = rootnode;
    this.iconsNode = rootnode.addChild()
    this.iconsNode.scale = new Scale(this.iconsNode);
    this.iconsNode.position = new Position(this.iconsNode)
    this.show = new Align(this.iconsNode).setY(-1)
       //.setScale(0,0);
    this.options = options;
    
    //addModal.call(this)

    var len = options.len || 10;
    var numSize = options.numSize || 50;
    var padding = options.padding || 20;
    var columns = options.columns || 4;
    var vert = options.vert || 30;
    var initZ = options.initZ || 2000;
    var borderRadius = options.borderRadius;
    this.colors = options.colors;

    this.iconsNode.addComponent({
        onReceive:function(e,p){
            console.log(e)
           if(e==="click"){
            clickedAnIcon.call(this, p.node.id, columns, len)
            //this.iconsNode.position.set(0,0,10, {duration:500})

            
            //findLocation(index)
           }
        }.bind(this)
    })

    this.iconInfo = []

    for (var i = 0; i < len; i++) {
        var xyz = iconPositions(i, padding, columns, numSize, 1, vert, len)

        var icon = this.iconsNode.addChild()
            .setSizeMode(1,1,1)
            .setAbsoluteSize(numSize, numSize)
        icon.id = i;
        
        this.iconInfo[i] = new Position(icon)
           .set(xyz[0],xyz[1],xyz[2])
        
        var content = './images/icons/'+options.content[i]+'.png';

        this.iconInfo[i].el = new DOMElement(icon, {
            content: '<img style="height:50px;width:50px" src="'+content+'" />',
            classes: ['icon',options.classes[i]||"default"],
            properties: {
                borderRadius: borderRadius
            }
        })
        
        icon.addUIEvent('click')
        
        //positions.set(xyz[0],xyz[1],0,{ duration:4000, curve: 'easeIn' })

        var iconText = icon.addChild()
            .setSizeMode(1,1,1)
            .setAbsoluteSize(50,10,0)
            .setMountPoint(0.5,1)
            .setAlign(0.5,1)
            .setPosition(0,15,0)

        new DOMElement(iconText, {
            content: options.iconText[i]||"Icon",
            properties:{
                fontSize: '10px',
                color:'white',
                textAlign: 'center'
            }
        })

       
    }

      

   
  
}

Icons.prototype.storeSizes = function(x,y){
    this.screenSizes = [x,y]
    //this.modal.setAbsoluteSize(x,y)
    //this.modal.setPosition(-x/2, -y/2)
}

Icons.prototype.animateForward = function(){
    var options = this.options
    var xy = layoutPad(options.numSize, options.padding, options.columns, options.len)
    this.root
        .setAbsoluteSize(xy[0],xy[1])
        .setAlign(-1.5,0.05)
        .setMountPoint(0.5,0)
    var len = this.iconInfo.length
    this.show.setY(0)
    for (var i = 0; i < len ;i++){
        this.iconInfo[i].setZ(0,{duration:1500, curve:'inOutExpo'})
        // var color = this.options.colors[i]||randomColor()
        // this.iconInfo[i].el.setProperty('background', color)
    }
}

Icons.prototype.showIcons = function(){
    this.iconsNode.scale.set(1,1,1, {duration:500, curve:'easeOut'})
    this.iconsNode.setPosition(0,0,0)  
}


function randomColor(){
    return 'rgb('+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+')'
}


function iconPositions(index, padding, columns, btnSizes, initZ, vert, len){
    var xPosition = padding + (index%columns) * (btnSizes + (padding))
    var yPosition = padding + (Math.floor(index / columns))* (vert+btnSizes) 
    var zPosition;
    if(index%columns===columns-1||index%columns===0){
        zPosition = initZ*300
    }
    if(index%columns < columns-1 && index%columns > 0){
        zPosition = initZ*110
        if(Math.ceil(index / columns)===1||Math.ceil(index / columns)===Math.ceil(len.length/columns)){
          zPosition += initZ*110
        }
    }
              
    return [xPosition, yPosition, zPosition]
}

function layoutPad(numSize, padding, columns, len){
   var width = padding + (numSize + padding) * columns
   var height = padding + (Math.ceil(len/ columns))*(padding+numSize)
   return [width, height]
}

function convertRange(OldMin, OldMax, NewMin, NewMax, OldValue){
    var OldRange = (OldMax - OldMin)  
    var NewRange = (NewMax - NewMin)  
    var  NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin
    return NewValue;
}

// function addModal(){
//     this.modal = this.root.addChild()
//     this.modal.setSizeMode(1,1,1)
//     this.modal.el =  new DOMElement(this.modal, {
//         properties:{
//             background:'white',
//             pointerEvents:'none'
//         }
//     })
    
//     this.modal.scale = new Scale(this.modal).set(0,0,0)

// }

// function openModal(x,y,index){
//     this.modal.setOrigin(x,y)
//     this.modal.scale.set(1,1,1, {duration:1000, curve: 'easeIn'})
//     //var site = 'http://localhost:1618/'
//     //var display = //'<iframe src="'+site+'" ></iframe>'
//     //this.modal.el.setContent(display)
// }

function findLocation(i){
    if(i===1){
        window.location = 'https://github.com/morgantheplant'
    }
}

function clickedAnIcon(index, columns, len){
    var x = convertRange(0, columns-1, 0, 1, index%columns)
    var rows = Math.ceil(len/columns)-1
    var y = convertRange(0, rows, 0, 1, Math.floor(index/columns))
    //openModal.call(this, x, y)
    this.iconsNode.setOrigin(x,y)
    this.iconsNode.scale.set(5,5,1, {duration:300, curve:'easeIn'}, function(){
     //this.iconsNode.setPosition(0,0,150)   
    }.bind(this))
}


module.exports = Icons;