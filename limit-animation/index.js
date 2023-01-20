/* Initialization */

function getGraphNumber(x) {
    const  xRange = MaxX() - MinX();
    const firstThirdMark = MinX() + 0.333 * xRange;
    const secondThirdMark = MinX() + 0.6667 * xRange
if(x <= firstThirdMark){
    return 1;
} else if (x > firstThirdMark && x <= secondThirdMark) {
    return 2;
} else {
    return 3;
}
}

const func1 = (x) => (x+5)**2-5;
const func2 = (x) => Math.sin(x)+0.5;
const func3 = (x) => x**1.2-3;

const F = function(x) {
    // Split the graph in thirds
    if (getGraphNumber(x) == 1) {
        return func1(x);
    } else if(getGraphNumber(x) == 2) {
        return func2(x);
    } else {
        return func3(x);
    }
  } ;
  
// To be called when the page finishes loading:
function init() {
    Draw() ;
   }
   
   
   /* Canvas and context objects */
   
   var Canvas = document.getElementById('plot'); 
   var Ctx = null ;
   
   var Width = Canvas.width ;
   var Height = Canvas.height ;
   
   
   /*
     The origin (0,0) of the canvas is the upper left:
   
     (0,0)
       --------- +X
      |
      |
      |
      |
      +Y
   
     Positive x coordinates go to the right, and positive y coordinates go down.
   
     The origin in mathematics is the "center," and positive y goes *up*.
   
     We'll refer to the mathematics coordinate system as the "logical"
     coordinate system, and the coordinate system for the canvas as the
     "physical" coordinate system.
   
     The functions just below set up a mapping between the two coordinate
     systems.
   
     They're defined as functions, so that one wanted to, they could read
     ther values from a from instead of having them hard-coded.
    
    */
   
   
   // Returns the right boundary of the logical viewport:
   function MaxX() {
     return 10 ;
   }
   
   // Returns the left boundary of the logical viewport:
   function MinX() {
     return -10 ;
   }
   
   // Returns the top boundary of the logical viewport:
   function MaxY() {
     return MaxX() * Height / Width;
   }
   
   // Returns the bottom boundary of the logical viewport:
   function MinY() {
      return MinX() * Height / Width;
   }
   
   // Returns the physical x-coordinate of a logical x-coordinate:
   function XC(x) {
     return (x - MinX()) / (MaxX() - MinX()) * Width ;
   }
   
   // Returns the physical y-coordinate of a logical y-coordinate:
   function YC(y) {
     return Height - (y - MinY()) / (MaxY() - MinY()) * Height ;
   }
   
   
   /* Rendering functions */
   
   // Clears the canvas, draws the axes and graphs the function F.
   function Draw() {
   
    if (Canvas.getContext) {
     
      // Set up the canvas:
      Ctx = Canvas.getContext('2d');
      Ctx.clearRect(0,0,Width,Height) ;
      // Draw:
      DrawAxes() ;
      RenderFunction(F) ;
     
     } else {
       // Do nothing.
     }
   }
   
   
   // Returns the distance between ticks on the X axis:
   function XTickDelta() {
     return 1 ;
   }
   
   // Returns the distance between ticks on the Y axis:
   function YTickDelta() {
     return 1 ;
   }
   
     
   // DrawAxes draws the X ad Y axes, with tick marks.
   function DrawAxes() {
    Ctx.strokeStyle = "black";
    Ctx.save() ;
    Ctx.lineWidth = 2 ;
    // +Y axis
    Ctx.beginPath() ;
    Ctx.moveTo(XC(0),YC(0)) ;
    Ctx.lineTo(XC(0),YC(MaxY())) ;
    Ctx.stroke() ;
   
    // -Y axis
    Ctx.beginPath() ;
    Ctx.moveTo(XC(0),YC(0)) ;
    Ctx.lineTo(XC(0),YC(MinY())) ;
    Ctx.stroke() ;
   
    // Y axis tick marks
    var delta = YTickDelta() ;
    for (var i = 1; (i * delta) < MaxY() ; ++i) {
     Ctx.beginPath() ;
     Ctx.moveTo(XC(0) - 5,YC(i * delta)) ;
     Ctx.lineTo(XC(0) + 5,YC(i * delta)) ;
     Ctx.stroke() ;  
     Ctx.font = "15px Arial";
     Ctx.textAlign = "center";
     Ctx.baseLine = "center";
     if (i%2 == 0) Ctx.fillText(i*delta,XC(-0.7),YC(i-0.1));
    }
   
    var delta = YTickDelta() ;
    for (var i = 1; (i * delta) > MinY() ; --i) {
     Ctx.beginPath() ;
     Ctx.moveTo(XC(0) - 5,YC(i * delta)) ;
     Ctx.lineTo(XC(0) + 5,YC(i * delta)) ;
     Ctx.stroke() ;  
     Ctx.font = "15px Arial";
     if (i%2 == 0 && i !== 0) Ctx.fillText(i*delta,XC(-0.7),YC(i-0.1));
    }  
   
    // +X axis
    Ctx.beginPath() ;
    Ctx.moveTo(XC(0),YC(0)) ;
    Ctx.lineTo(XC(MaxX()),YC(0)) ;
    Ctx.stroke() ;
   
    // -X axis
    Ctx.beginPath() ;
    Ctx.moveTo(XC(0),YC(0)) ;
    Ctx.lineTo(XC(MinX()),YC(0)) ;
    Ctx.stroke() ;
   
    // X tick marks
    var delta = XTickDelta() ;
    for (var i = 1; (i * delta) < MaxX() ; ++i) {
     Ctx.beginPath() ;
     Ctx.moveTo(XC(i * delta),YC(0)-5) ;
     Ctx.lineTo(XC(i * delta),YC(0)+5) ;
     Ctx.stroke() ;  
     Ctx.textAlign = "center";
     if (i%2 == 0) Ctx.fillText(i*delta,XC(i*delta),YC(-1));
    }
   
    var delta = XTickDelta() ;
    for (var i = 1; (i * delta) > MinX() ; --i) {
     Ctx.beginPath() ;
     Ctx.moveTo(XC(i * delta),YC(0)-5) ;
     Ctx.lineTo(XC(i * delta),YC(0)+5) ;
     Ctx.stroke() ;  
     if (i%2 == 0 && i !==0) Ctx.fillText(i*delta,XC(i*delta),YC(-1));

    }
    Ctx.restore() ;
   }
   
   
   // When rendering, XSTEP determines the horizontal distance between points:
   var XSTEP = (MaxX()-MinX())/Width ;
   
   
   // RenderFunction(f) renders the input funtion f on the canvas.
   function RenderFunction() {
        Ctx.clearRect(0,0,Width,Height) ;
      DrawAxes() ;
    let currentGraphNum = 0;
     for (var x = MinX(); x <= MaxX(); x += XSTEP) {
      var y = F(x) ;
      const graphNum = getGraphNumber(x);
      if (graphNum == 1) {
        if (currentGraphNum == 0) {
            Ctx.beginPath();
            Ctx.moveTo(XC(x),YC(y)) ;
            currentGraphNum = 1;
            Ctx.stroke() ;
        } else {
            Ctx.lineTo(XC(x),YC(y)) ;
            Ctx.strokeStyle = 'blue'; 
            Ctx.stroke() ; 
        }
      } else if (graphNum == 2) {
        if (currentGraphNum == 1) {
            // Draw the dot at the end of the previous segment
            drawCircle(Ctx,XC(x-XSTEP),YC(F(x-XSTEP)),4,'blue');

              // Draw the dot at the start of the current segment
              drawCircle(Ctx,XC(x),YC(F(x)),4,'green','green');
              
            Ctx.beginPath();
            Ctx.moveTo(XC(x),YC(y)) ;
            currentGraphNum = 2;
            Ctx.stroke() ;
        } else {
            Ctx.lineTo(XC(x),YC(y)) ;
            Ctx.strokeStyle = 'green'; 
            Ctx.stroke() ; 
        }
      } else {
        if (currentGraphNum == 2) {
            // Draw the dot at the end of the previous segment
            drawCircle(Ctx,XC(x-XSTEP),YC(F(x-XSTEP)),4,'green');

              // Draw the dot at the start of the current segment
              drawCircle(Ctx,XC(x),YC(F(x)),4,'red','red');
            Ctx.beginPath();
            Ctx.moveTo(XC(x),YC(y)) ;
            currentGraphNum = 3;
            Ctx.stroke() ;
        } else {
            Ctx.lineTo(XC(x),YC(y)) ;
            Ctx.strokeStyle = 'red'; 
            Ctx.stroke() ; 

        }
      }

     }
renderBead();
if(animating) requestAnimationFrame(RenderFunction)
     
   }
   function drawCircle(Ctx,x,y,radius=4,color,fillColor=null) {
    Ctx.beginPath();
    Ctx.arc(x,y, radius, 0, 2 * Math.PI);
    Ctx.strokeStyle= color || '#000';
    Ctx.stroke(); 
    if (fillColor) {
        Ctx.fillStyle = fillColor
        Ctx.fill();
    }
   }

let animating = false;
let defaultBeadRadius = 5;
let currentBeadRadius = 5;
let maxBeadRadius = 7;
let minBeadRadius = 2;
let currentBeadOffset = 450;

let beadIncreasing = true;
let offsetMovingRight = true;
let offsetDelta = 1;
function renderBead() {
    let x = MinX();
    currentBeadOffset = getNextBeadOffset(currentBeadOffset);
    let currX = x+currentBeadOffset*XSTEP;
    let currY = F(currX);
    currentBeadRadius = animating ? getNextBeadRadius(currentBeadRadius) : defaultBeadRadius;
    drawCircle(Ctx,XC(currX),YC(currY),currentBeadRadius,'black','black');
    if(!animating) {
        drawHorLine(currX,currY)  
    }
    drawCoords(currX,currY);

   }

   function getNextBeadOffset(offset) {
    if (offset > 450) offsetMovingRight = false;
    if (offset < 30) offsetMovingRight = true;
    if (offsetMovingRight) {
        return offset + offsetDelta;
    } else {
        return offset - offsetDelta;
    }
   }

   function getNextBeadRadius(r) {

    if (r > maxBeadRadius) beadIncreasing = false;
    if (r < minBeadRadius) beadIncreasing = true;

    if (beadIncreasing) {
        return r+1;
    } else {
        return r-1;
    }
   }

   document.getElementById('animate').addEventListener('click',(e)=>{
    animating = animating ? false : true;

    if(animating) {
        offsetDelta = 1;
        requestAnimationFrame(RenderFunction)
        showById('pause-button');
        hideById('play-button');
    } else {
        drawHorLine(F(MinX()+currentBeadOffset));
        showById('play-button');
        hideById('pause-button');

    }
   })

   document.getElementById('left').addEventListener('click',()=>{
    offsetMovingRight = false;
    if (!animating) {
        offsetDelta = 1;
        RenderFunction();
    }
   });

   document.getElementById('right').addEventListener('click',()=>{
    offsetMovingRight = true;
    if (!animating) {
        offsetDelta = 1;
        RenderFunction();
    }
   });
function drawHorLine(x,y) {
    Ctx.beginPath();
    Ctx.moveTo(XC(x),YC(y));
    Ctx.setLineDash([5]);
    Ctx.lineTo(XC(0),YC(y));
    Ctx.stroke();
    Ctx.setLineDash([]);
}

function drawCoords(beadX,beadY) {
    const coordsDisplay = document.getElementById('coords');
    coordsDisplay.innerText = `(${beadX.toFixed(1)} , ${beadY.toFixed(1)})`
}

function showById(id) {
    document.getElementById(id).classList.remove('hidden');
}
function hideById(id) {
    document.getElementById(id).classList.add('hidden');
}

   init();
