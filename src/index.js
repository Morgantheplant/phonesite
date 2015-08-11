'use strict';
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var GestureHandler = require('famous/components/GestureHandler');
var Position = require('famous/components/Position');
var Transitionable = require('famous/transitions/Transitionable');
var Camera = require('famous/components/Camera');
var DateAndTime = require('./DateAndTime');
var Slider = require('./Slider');
var NumberPad = require('./NumberPad');
var Modal = require('./Modal');
var Background = require('./Background');

function WebSite(){
    this.scene = FamousEngine.createScene();
    this.root = this.scene.addChild();
    new Camera(this.root).setDepth(100);

    this.draggerNode = this.root.addChild();
    this.draggerNode.el = new DOMElement(this.draggerNode);
    this.draggerNode.pos = new Position(this.draggerNode);
    
    this.timeNode = this.draggerNode.addChild();
    new DateAndTime(this.timeNode);

    this.sliderNode = this.draggerNode.addChild();
    new Slider(this.sliderNode);
    
    this.batteryNode = this.root.addChild();
    new Battery(this.batteryNode);

    this.receptionNode = this.root.addChild();
    new Reception(this.receptionNode);
    
    this.cameraNode = this.root.addChild();
    this.cameraNode.pos = new Position(this.cameraNode);
    new CameraIcon(this.cameraNode);

    this.backgroundNode = this.root.addChild();
    this.background = new Background(this.backgroundNode);
    this.background.scaleBg();

    this.modalNode = this.root.addChild();
    this.modal = new Modal(this.modalNode);
    
    

    this.numbers = this.draggerNode.addChild();
    this.numberPad = new NumberPad(this.numbers);
    this.numberPad.mainBG = this.background.blur;
   
    FamousEngine.init();

    _positionChildren.call(this);
    _bindEvents.call(this);

}

new WebSite();

function _positionChildren(){

    this.timeNode
        .setAlign(0.5,0.13)
        .setMountPoint(0.5,0);

    this.draggerNode
        .setSizeMode(0,0)
        .setProportionalSize(0.5,0.95)
        .setAlign(0.5,0.5)
        .setMountPoint(0.5,0.5);

    this.sliderNode
        .setSizeMode(1,1)
        .setAbsoluteSize(170,50)
        .setMountPoint(0.5,0.97)
        .setAlign(0.5,1);

    this.receptionNode
        .setSizeMode(0,1)
        .setAbsoluteSize(undefined,30)
        .setPosition(10,7);

    this.batteryNode
        .setSizeMode(0,1)
        .setAbsoluteSize(undefined,30)
        .setPosition(-70, 7)
        .setAlign(1,0);

    this.cameraNode
        .setSizeMode(1,1)
        .setAbsoluteSize(25,25)
        .setAlign(1,1)
        .setMountPoint(1,1);

    this.numbers
        .setAlign(-1.5,0.5)
        .setMountPoint(0.5,0.5)
        .setPosition(0,0,1);

    this.modal.initBlackScreen();

    this.root.addComponent({
        onReceive:function(e,p){
            if(e==='click'&&p.node.hideModal){
                this.numberPad.showIcons();
            }

        }.bind(this),
        onSizeChange: function(x,y){
            this.screenSize = [x,y];
            this.numberPad.storeSizes(x,y); 
            if(this.padisShowing){
                layoutPad.call(this);
            }
        }.bind(this)
    });

}

function _bindEvents(){
    
    new GestureHandler(this.draggerNode, [
        {event:'drag', callback: drag.bind(this)}
    ]);
    
    this.draggerNode.addComponent({
        onReceive: function(e, payload){
            if(e==='click'&&payload.node.id!==undefined){
                this.modal.show(payload.node.id);
            }

            if(payload.node.cancel){
                this.padisShowing = false;
                // inner transitionable is not working
                // this is a hack to update the internal state
                var t = new Transitionable(this.screenSize[0]);
                var timer = FamousEngine.getClock().setInterval(function(){
                    this.draggerNode.pos.setX(t.get());
                      this.cameraNode.pos.setX(t.get());
            
                }.bind(this), 16);

               
                t.set(0,{duration:700, curve:lessElastic}, function(){
                    FamousEngine.getClock().clearTimer(timer);
                    this.background.scaleBg();
                }.bind(this));
                // Not sure why this method call isn't working
                // could be a bug?
               //centerDragger.call(this)

               // this works, but adding a duration doesn't:
               //this.draggerNode.pos.setX(0)
                
            }

            if(payload.node.remove){
                this.numberPad.removeTheDot();
            }

        }.bind(this)
    });


}




function drag(e){
    var centerScreen = this.screenSize[0];
    var currentPos = this.draggerNode.pos.getX();
    var newPosX = currentPos + e.centerDelta.x;
    this.draggerNode.pos.setX(newPosX);
    this.cameraNode.pos.setX(newPosX);
    this.background.blur.opacity.set(newPosX/centerScreen);
    if(e.status==='end'&&newPosX<175){
        centerDragger.call(this);
    }
    
    if(newPosX>=175){
        this.padisShowing = true;
        this.draggerNode.pos.setX(centerScreen,{duration:900, curve:'outElastic'});
        this.background.blur.opacity.set(1, {duration:300, curve:'outElastic'});
    }

}

function centerDragger(){
    this.draggerNode.pos.setX(0,{duration:900, curve:'outElastic'});
    this.cameraNode.pos.setX(0,{duration:900, curve:'outElastic'});
}

function layoutPad(){
    var centerScreen = (this.screenSize[0]);
    this.draggerNode.pos.setX(centerScreen);
}



function Reception(node){  
    new DOMElement(node, {
        content: 'ooooo&nbsp;&nbsp;Morgizon&nbsp;&nbsp;<i class="fa fa-rss"></i>',
        properties: {
            'font-size':'12px',
            'color':'white'
        }
    });   
}

function Battery(node){
    new DOMElement(node, {
        content: '100%  [<span style="color:lime">||||</span>]  <i class="fa fa-bolt"></i>',
        properties: {
            'font-size':'12px',
            'color':'white'
        }
    });     
}

function CameraIcon(node){
    new DOMElement(node, {
        classes: ['fa','fa-camera'],
        properties: {
            'font-size':'12px',
            'color':'white'
        }
    });     
}

function lessElastic(t) {
    var s=4.70158;var p=0;var a=1.0;
    if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
    s = p/(2*Math.PI) * Math.asin(1.0/a);
    return a*Math.pow(2,-15*t) * Math.sin((t-s)*(2*Math.PI)/p) + 1.0;
}

