'use strict';
var DOMElement = require('famous/dom-renderables/DOMElement');
var FamousEngine = require('famous/core/FamousEngine');
var Opacity = require('famous/components/Opacity');
var clock = FamousEngine.getClock();

function Slider(node){
    var textAry = '> slide to unlock'.split(''); 
    this.letters= {};
    this.count = 0;
    this.aryLength = textAry.length;
    
    for(var i = 0; i < this.aryLength; i++){
        var child = node.addChild();

        this.letters[i] = { 
            node: child,
            opacity: new Opacity(child),
            el: new Letter(child, { text: textAry[i]})
        };
        

        child.setSizeMode(1,1,1)
            .setAbsoluteSize(8,15)
            .setPosition(i*10,0,0);

       this.letters[i].opacity.set(0.4);
    }
   
    letterTransition.call(this);

    clock.setInterval(function(){
        letterTransition.call(this);
    }.bind(this),4000);
}



function Letter(node, options){
    this.el = new DOMElement(node, {
        content: options.text,
        properties:{
            'text-align':'center',
            'color':'white',
            'font-size':'18px'
        }
    });
}


   
function letterTransition(){
    //loop through letters using the counter 
    //if counter hasn't reached end
    //console.log(this.count)
    if(this.count<this.aryLength){
        //transition the opacity of the letter to 1
       // var item = this.letters[count]
        var items = this.letters;
        var count = this.count;
        //console.log('outer', count)
        this.letters[this.count].opacity.set(1, {duration:450}, function(){
            clock.setTimeout(function(){
                items[count].opacity.set(0.4, {duration:450});
            }, 800);
        });

        //wait a period of time and transition back to initial
        
        //call on itself again
        clock.setTimeout(function(){
            //increment counter
            this.count++;
            letterTransition.call(this);
        }.bind(this),200);
    } 

    if(this.count===this.aryLength){
      //if at the end reset the counter
      this.count = 0;
    }

}
   
module.exports = Slider;
