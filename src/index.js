'use strict';
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var GestureHandler = require('famous/components/GestureHandler');
var Position = require('famous/components/Position')
var DateAndTime = require('./DateAndTime');
var Slider = require('./Slider')


function WebSite(){
    this.scene = FamousEngine.createScene();
    this.root = this.scene.addChild();

    this.draggerNode = this.root.addChild();
    this.draggerNode.el = new DOMElement(this.draggerNode)
    this.draggerNode.pos = new Position(this.draggerNode)

    this.timeNode = this.draggerNode.addChild();
    new DateAndTime(this.timeNode);

    this.sliderNode = this.draggerNode.addChild();
    new Slider(this.sliderNode)
    
    this.batteryNode = this.root.addChild();
    new Battery(this.batteryNode);

    this.receptionNode = this.root.addChild();
    new Reception(this.receptionNode);
    
    this.cameraNode = this.root.addChild();
    new Camera(this.cameraNode)


    FamousEngine.init();

    _positionChildren.call(this)
    _bindEvents.call(this)

}

new WebSite()

function _positionChildren(){

    this.timeNode
        .setAlign(0.5,0.13)
        .setMountPoint(0.5,0)

    this.draggerNode
        .setSizeMode(0,0)
        .setProportionalSize(0.5,0.75)
        .setAlign(0.5,0.5)
        .setMountPoint(0.5,0.5)

    this.sliderNode
        .setSizeMode(1,1)
        .setAbsoluteSize(135,50)
        .setMountPoint(0.5,0.97)
        .setAlign(0.5,1)

    this.receptionNode
        .setSizeMode(0,1)
        .setAbsoluteSize(undefined,30)
        .setPosition(10,7)

    this.batteryNode
        .setSizeMode(0,1)
        .setAbsoluteSize(undefined,30)
        .setPosition(-70, 7)
        .setAlign(1,0)

    this.cameraNode
        .setSizeMode(1,1)
        .setAbsoluteSize(25,25)
        .setAlign(1,1)
        .setMountPoint(1,1)
    

}

function _bindEvents(){
    
    var gesture = new GestureHandler(this.draggerNode, [
        {event:'drag', callback: drag.bind(this)}
    ]);

}

function drag(e){
    var currentPos = this.draggerNode.pos.getX()
    var newPosX = currentPos + e.centerDelta.x
    this.draggerNode.pos.setX(newPosX)
    
    if(e.status==='end'){
        this.draggerNode.pos.setX(0,{duration:900, curve:'outElastic'})
    }

}

// var spinner = logo.addComponent({
//     onUpdate: function(time) {
//         logo.setRotation(0, time / 1000, 0);
//         logo.requestUpdateOnNextTick(spinner);
//     }
// });
// logo.requestUpdate(spinner);


function Reception(node){  
    new DOMElement(node, {
        content: 'ooooo&nbsp;&nbsp;Morgizon&nbsp;&nbsp;<i class="fa fa-rss"></i>',
        properties: {
            'font-size':'12px',
            'color':'white'
        }
    })   
}

function Battery(node){
    new DOMElement(node, {
        content: '100%  [<span style="color:lime">||||</span>]  <i class="fa fa-bolt"></i>',
        properties: {
            'font-size':'12px',
            'color':'white'
        }
    })     
}

function Camera(node){
    new DOMElement(node, {
        classes: ['fa','fa-camera'],
        properties: {
            'font-size':'12px',
            'color':'white'
        }
    })     
}