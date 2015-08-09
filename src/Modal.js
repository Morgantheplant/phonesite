'use strict';
var DOMElement = require('famous/dom-renderables/DOMElement');
var GestureHandler = require('famous/components/GestureHandler');
var Position = require('famous/components/Position')
var Transitionable = require('famous/transitions/Transitionable');
var Scale = require('famous/components/Scale');
var Opacity = require('famous/components/Opacity');
var iconData = require('./iconData');
var FamousEngine = require('famous/core/FamousEngine');

function Modal(node){

    this.node = node

    this.modalEl =  new DOMElement(this.node, {
        classes:['modal'],
        properties:{
            background:'black',
            color:'white',
            overflow:'scroll'
        }
    })
    
    this.scale = new Scale(this.node)
    this.position = new Position(this.node)
    this.opacity = new Opacity(this.node)

    this.closeNode = this.node.addChild()
    this.closeNode.setSizeMode(1,1,1)
    this.closeNode.setPosition(0,0,6)
    this.closeNode.setAbsoluteSize(25,25)
    this.closeNode.setAlign(.95,0.05)
    this.closeNode.setMountPoint(.95,0)
    this.closer = new DOMElement(this.closeNode,{
        content:'<i class="fa fa-times-circle-o"></i>',
        classes:['closer']
    })
    this.closeNode.hideModal = true;
    this.closeNode.addUIEvent('click')
    this.closeNode.addComponent({
        onReceive: function(e){
            this.hide(150)
        }.bind(this)
    })

}

Modal.prototype.hide = function(time){
    if(!time){
        this.scale.set(0,0,0)
    }
    if(time){
        this.scale.set(0,0,0, {duration:time})
        this.position.set(0,0,5,{duration:150})
    }
}

Modal.prototype.initBlackScreen = function(){
    this.scale.set(1.5,1.5,1)
    this.position.set(0,0,5)
    //this.show()
    FamousEngine.getClock().setTimeout(function(){
        this.opacity.set(0, {duration:2000, curve:'easeInOut'}, function(){
            this.hide(150)
        }.bind(this))
    }.bind(this),1000)
}

Modal.prototype.show = function(index){
    var icon = iconData.classes[index]
    var content = iconData.content[index]
    this.opacity.set(1)

    var xy = findOrigin(index);
  
    this.node.setOrigin(xy[0],xy[1])
    this.position.set(0,0,5,{duration:150}, function(){
        this.scale.set(1,1,1, {duration:150})
        this.position.set(0,0,5, {duration:150})       
    }.bind(this))
    
    if( icon !== 'Camera'){
        var title = '<div id="modal_text_container">'+content+'</div>'
        this.modalEl.setContent(title)
    }
    if(icon === 'Camera'){
        this.modalEl.setContent('<video autoplay style="height:100%;width:100%"></video>')
        startCamera.call(this);

    }
    if(icon.toLowerCase()==='github'||icon.toLowerCase()==='linkedin'){
        redirect(icon)
    }
}


function findOrigin(index, columnNumber, length){
    var columns = columnNumber || 4;
    var len = length || 17;
    var rows = Math.ceil(len/columns)-1;
    var x = convertRange(0, columns-1, 0, 1, index%columns)
    var y = convertRange(0, rows, 0, 1, Math.floor(index/columns))
    return [x,y]
}

function convertRange(OldMin, OldMax, NewMin, NewMax, OldValue){
    var OldRange = (OldMax - OldMin)  
    var NewRange = (NewMax - NewMin)  
    var  NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin
    return NewValue;
}


function returnCorrectUserMedia () {
  
  
    if(navigator.webkitGetUserMedia){
        return "webkitGetUserMedia";
    }
    
    if(navigator.getUserMedia){
        return "getUserMedia";
    }

    if(navigator.mozGetUserMedia){
        return "mozGetUserMedia";
    }

    if(navigator.msGetUserMedia){
        return "msGetUserMedia";
    }

    return false;
}


function errorCallback (e) {
     this.modalEl.setContent('<h1>Camera rejected!</h1>')
};

function startCamera(){

   var validNavigatorPrefix = returnCorrectUserMedia()
    
    if (validNavigatorPrefix) {
        
        navigator[validNavigatorPrefix]({video: true}, 
            function(localMediaStream) {
                var video = document.querySelector('video');
                video.src = window.URL.createObjectURL(localMediaStream);

                // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
                // See crbug.com/110938.
                video.onloadedmetadata = function(e) {
                // Ready to go. Do some stuff.
                };
        }, errorCallback.bind(this));
    
    }

    if(!validNavigatorPrefix) {
        this.modalEl.setContent('<input id="image_input" type="file" accept="image/*;capture=camera" onchange="updateImage(this)"><br /><img id="myimage" src="" />')
     
    }
  
}

function displayAsImage(file) {
  var imgURL = URL.createObjectURL(file),
      img = document.createElement('img');

  img.onload = function() {
    URL.revokeObjectURL(imgURL);
  };

  img.src = imgURL;
  document.body.appendChild(img);
}

function redirect(site){
    var path = iconData.links[site.toLowerCase()] || 'https://github.com/morgantheplant'
    FamousEngine.getClock().setTimeout(function(){
        var okToLeave = confirm('You are being redirected to ' + site + '. Would you like to continue?');
        if(okToLeave){
            window.location = path;
        }
    },1000)  

}

module.exports = Modal;
