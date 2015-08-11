'use strict';
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
 

function DateAndTime(node, options){
    //scene and nodes
    this.dateAndTimeNode = node;
    this.time = this.dateAndTimeNode.addChild();
    this.date = this.time.addChild();
    
    this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.monthNames = ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September','October', 'November', 'December'];

    _addElements.call(this);
    _positionElements.call(this);

    FamousEngine.requestUpdateOnNextTick(this);

}

function _addElements(){
    
    this.time.el = new DOMElement(this.time, {
        properties:{
            'color':'white',
            'font-size':'68px',
            'font-family':"'Arimo',Droid Sans', sans-serif",
            'text-align':'center'
        }
    });
    
    this.date.el = new DOMElement(this.date, {
        properties: {
            'font-size':'16px',
            //'background':'grey',
            'text-align':'center'
        }
    });


}


function _positionElements(){
    this.dateAndTimeNode.setSizeMode(1,1,1)
        .setAbsoluteSize(250,100);
    
    this.time.setSizeMode(1,1,1)
        .setAbsoluteSize(200,100)
        .setAlign(0.5,0)
        .setMountPoint(0.5,0);

    this.date.setSizeMode(1,1,1)
        .setAbsoluteSize(200,20)
        .setAlign(0,1)
        .setMountPoint(0,1);
}


DateAndTime.prototype.onUpdate = function(){
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
            
    minutes = ( minutes < 10 ? "0" : "" ) + minutes; 
    hours = ( hours > 12 ) ? hours - 12 : hours;
    hours = ( hours === 0 ) ? 12 : hours;
            
    var dateString = this.dayNames[date.getDay()] + ", " + this.monthNames[date.getMonth()] + ' ' + date.getDate();

    var timeString = hours + ":" + minutes; 
              
    if(this.time.el._content !== timeString){
        this.time.el.setContent(timeString);
    }
    
    if(this.date.el._content !== dateString){
        this.date.el.setContent(dateString);
    }

    FamousEngine.requestUpdateOnNextTick(this);
};

module.exports = DateAndTime;
