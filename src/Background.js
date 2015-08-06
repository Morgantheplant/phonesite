var DOMElement = require('famous/dom-renderables/DOMElement');
var GestureHandler = require('famous/components/GestureHandler');
var Position = require('famous/components/Position')
var Transitionable = require('famous/transitions/Transitionable');
var Scale = require('famous/components/Scale');
var Opacity = require('famous/components/Opacity');
var FamousEngine = require('famous/core/FamousEngine');


function Background(node, options){
    node.setPosition(0,0,-5)
        .setSizeMode(0,0,0)
        .setMountPoint(0.5,0.5)
        .setAlign(0.5,0.5)
        .setProportionalSize(1.5,1.5)
        .setOrigin(0.5,0.5)

    this.scale = new Scale(node);
    this.main = node.addChild();

    new DOMElement(this.main, {
        tagName:'img',
        attributes:{
          src:'./images/stars.jpg'
        }
    });

    this.blur = node.addChild()
        .setPosition(0,0,0);
    this.blur.opacity = new Opacity(this.blur)
        .set(0);

    new DOMElement(this.blur, {
        tagName:'img',
        attributes:{
          src:'./images/stars_blur.jpg'
        }
    });


}

Background.prototype.scaleBg = function(){
   this.scale.halt()
   this.scale.set(1.05,1.05,1, {duration:5000, curve:'easeInOutBounce'}, function(){
       this.scale.set(1,1,1, {duration:5000, curve:'easeIn'})
   }.bind(this))
}

Background.prototype.showBlur = function(){
    this.blur.opacity.set(1);
}

Background.prototype.hideBlur = function(){
    this.blur.opacity.set(0, {duration:1000});
}

module.exports = Background;