'use strict';
var DOMElement = require('famous/dom-renderables/DOMElement');
var GestureHandler = require('famous/components/GestureHandler');
var Position = require('famous/components/Position')
var Transitionable = require('famous/transitions/Transitionable');
var Scale = require('famous/components/Scale');
var iconData = require('./iconData');

function Modal(node){
    this.node = node;
    this.modalEl =  new DOMElement(this.node, {
        properties:{
            background:'black',
            color:'white'
        }
    })
    
    this.scale = new Scale(this.node)
    this.position = new Position(this.node)
    
    this.closeNode = this.node.addChild()
    this.closeNode.setSizeMode(1,1,1)
    this.closeNode.setAbsoluteSize(25,25)
    this.closeNode.setAlign(1,0)
    this.closeNode.setMountPoint(1,0)
    this.closer = new DOMElement(this.closeNode,{
        content:'<i class="fa fa-times-circle-o"></i>',
        classes:['closer']
    })
    this.closeNode.hideModal = true;
    this.closeNode.addUIEvent('click')
    this.closeNode.addComponent({
        onReceive: function(e){
            this.hide(200)
        }.bind(this)
    })

}

Modal.prototype.hide = function(time){
    if(!time){
        this.scale.set(0,0,0)
    }
    if(time){
        this.scale.set(0,0,0, {duration:time})
        this.position.set(0,0,-1000,{duration:200})
    }
}

Modal.prototype.show = function(index){
    var content = iconData.content[index]
    if( content !== 'Camera'){
        var title ='<h1 id="modal_text">'+content+'</h1><p>Coming Soon...</p>'
        this.modalEl.setContent(title)
    }
    if(content === 'Camera'){
        this.modalEl.setContent('<video autoplay style="height:100%;width:100%"></video>')
        startCamera.call(this);
    }

    var xy = findOrigin(index);
  
    this.node.setOrigin(xy[0],xy[1])
    this.position.set(0,0,-1000,{duration:150}, function(){
        this.scale.set(1,1,1, {duration:200})
        this.position.set(0,0,0, {duration:200})       
    }.bind(this))
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
  
    if(navigator.getUserMedia){
        return "getUserMedia";
    }
  
    if(navigator.webkitGetUserMedia){
        return "webkitGetUserMedia";
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
     alert('getUserMedia() is not supported in your browser');
    }
  
}

module.exports = Modal;
