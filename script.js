
//Make DOVE RABBIT again with original rotation settings ( allread reverted) See if it solves the not loading issue. Old rabbit to bird still works for som reason

//saveAs, uploadToexampleProjects, add name to exampleProjectsArray;


window.onload = function(){
  App.build(magicFrame);
  magicFrame.init();
     
}

var magicFrame = new App();
magicFrame.data = {dpi:{label: "dpi", val: 96, min:72, max:300, step:1, templateId:"valuedSlider", parentId: "frameSettingsDiv"},
                   width:{label: "width mm", val: 180, min:0, max:500, step:1, templateId:"valuedSlider", parentId: "frameSettingsDiv"},
                   height:{label: "height mm", val: 100, min:0, max:500, step:1, templateId:"valuedSlider", parentId: "frameSettingsDiv"},
                   bleed:{label: "bleed mm", val:0.5, min:0, max:2, step:0.5, templateId:"valuedSlider", parentId: "frameSettingsDiv"},
                   diameter:{label: "hole mm", val:2, min:0, max:100, step:1, templateId:"valuedSlider", parentId: "frameSettingsDiv"},
                   
                   state1Text:{label: "text", val:"YES", templateId:"textInput", parentId: "message1Div"},
                   state1Image:{label: "image", val:document.createElement("img"), templateId:"fileInput", parentId: "message1Div"},
                   state1Scale:{label: "scale %", val: 10, min:0, max:100, step:1, templateId:"valuedSlider", parentId: "message1Div"},
                   state1X:{label: "x %", val: 50, min:-200, max:200, step:1, templateId:"valuedSlider", parentId: "message1Div"},
                   state1Y:{label: "y %", val: 50, min:-200, max:200, step:1, templateId:"valuedSlider", parentId: "message1Div"},
                   state1Rot:{label: "deg", val: 0, min:0, max:360, step:1, templateId:"valuedSlider", parentId: "message1Div"},
                  
                   state2Text:{label: "text", val:"NO", templateId:"textInput", parentId: "message2Div"},
                   state2Image:{label: "image", val:document.createElement("img"), templateId:"fileInput", parentId: "message2Div"},
                   state2Scale:{label: "scale %", val: 10, min:0, max:100, step:1, templateId:"valuedSlider", parentId: "message2Div"},
                   state2X:{label: "x %", val: 50, min:-200, max:200, step:1, templateId:"valuedSlider", parentId: "message2Div"},
                   state2Y:{label: "y %", val: 50, min:-200, max:200, step:1, templateId:"valuedSlider", parentId: "message2Div"},
                   state2Rot:{label: "deg", val: 0, min:0, max:360, step:1, templateId:"valuedSlider", parentId: "message2Div"},
                 
                   
                  }

//App.duplicateData(magicFrame.data, "state1", "state2",[["message1Div","message2Div"],["YES","NO"]]);

magicFrame.exampleProjectPaths = ["YES NO", "Dove to Rabbit", "Arrows"];

magicFrame.canvas = document.getElementById("fullPageCanvas");
magicFrame.ctx = magicFrame.canvas.getContext("2d");

magicFrame.checkOddOrEven = function(number) {
    return number % 2 === 0 ? 'Even' : 'Odd';
}

magicFrame.mmToPx = function(mm){
  return mm/25.4*this.data.dpi.val;
}


magicFrame.saveProject = function(){
  var savedData = {};
  for(var props in this.data){
    if(typeof this.data[props].val === "object"){
      savedData[props] ={src:this.data[props].val.src};
    }
    else{
      savedData[props] =this.data[props].val;
    }
    
  }
  var text = JSON.stringify(savedData);
  var href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  App.downloadFile("Magic Frame Data.txt", href);
}


magicFrame.openProject = function(element){
  let fr = new FileReader();     
           fr.readAsText(element.files[0]);
           fr.onload = function () {
             var openedData = JSON.parse(fr.result);
             window.confirm("Expect a few seconds to load your file?");
             magicFrame.loadProject(openedData);
            }
}



magicFrame.makeGui = function(){
  var exampleFilesSelect = document.getElementById("exampleFilesSelect");
  for(var i = 0; i< this.exampleProjectPaths.length; i++){
    var option = document.createElement("option");
    option.innerHTML = this.exampleProjectPaths[i];    
    exampleFilesSelect.append(option);
  }
}



magicFrame.exampleSelectListener = function(select){
  //window.confirm("Expect a few seconds to load the example?");
  var path = '/exampleProjects/'+select.value+".txt";
  magicFrame.loadFromFilePath(path);
}


magicFrame.loadFromFilePath = function(path){
  fetch(path)
  .then(response => response.text())
  .then(data => {
    this.loadProject(JSON.parse(data));
    //console.log(path, data);
  })
  .catch(error => {
    console.error('Error fetching the text file:', error);
  });
}



magicFrame.loadFromFile = function(file){
  
  //"exampleProjects/rabbit.txt"
  let fr = new FileReader();     
           fr.readAsText(file);
           fr.onload = function () {
             var openedData = JSON.parse(fr.result);
             magicFrame.loadProject(openedData);
           }
}

magicFrame.loadProject = function(savedData){
  //alert("loading");
  for(var props in savedData){
    if(typeof this.data[props].val === "object"){
      this.data[props].val.src =savedData[props].src;
    }
    else{
      App.setter(this.data[props],"val", savedData[props])
      //this.data[props].val =savedData[props];
    }
  }
     var generateButton = document.getElementById("generateButton");
     generateButton.classList.add("flash");
     generateButton.addEventListener("animationend", ()=>{
       generateButton.classList.remove("flash");
     })
    //magicFrame.update();
}

magicFrame.saveCanvas = function(){
    var paperSizeString = prompt("This will download an image file the same size as your chosen paper. Print with 'fit to page' and 'zero border' to ensure correct sizing. Enter your paper Size mm...", "210x297");
    var paperSize = paperSizeString.split("x");
    paperSize[0] = this.mmToPx(paperSize[0]);
    paperSize[1] = this.mmToPx(paperSize[1]);
    //var paperWidth = parseInt(paperSize[0]);
    //var paperHeight = parseInt(paperSize[1]);
    var paperCanvas = document.createElement("canvas");
    paperCanvas.width = parseInt(paperSize[0]);
    paperCanvas.height = parseInt(paperSize[1]);
    var contentCanvas = this.fullPageCanvas;
    var paperCtx = paperCanvas.getContext("2d");
    //var contentIntendedWidth = 
    paperCtx.drawImage(contentCanvas,paperCanvas.width/2 - contentCanvas.width/2, paperCanvas.height/2 - contentCanvas.height/2);
  // get canvas data  
    var image = paperCanvas.toDataURL();    
    App.downloadFile("Magic Frame.png", image);  
  }

magicFrame.makeHolesCanvas = function(){
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = this.mmToPx(this.data.width.val);
  canvas.height = this.mmToPx(this.data.height.val);
  
  var d = this.mmToPx(this.data.diameter.val);
    for(var y = 0; y<canvas.height; y+=d){
      var shiftx = 0;
        if(this.checkOddOrEven(Math.round(y/d)) === "Even"){
          shiftx =d;
        }
      for(var x = 0; x<canvas.width; x+=d*2){//*2       
        ctx.beginPath();
        ctx.arc(x + shiftx, y, d/2, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        //holesCtx.fillRect(x + shiftx, y, d, d);
      }
    }
  return canvas;
}


//magicFrame.drawInsideHoles(holesCanvas, )

//make canvas, draw holes in it, make it composite, draw from keyPrefix
magicFrame.drawPrefixInsideHoles = function(prefix){
  var canvas = this.makeHolesCanvas();
  var ctx = canvas.getContext("2d"); 
  ctx.globalCompositeOperation = 'source-atop';
  
  const itemWidth = 0;
  const itemHeight = 0;
  const itemX = this.data[prefix+"X"].val/100*canvas.width; // X position of the rectangle's top-left corner
  const itemY = this.data[prefix+"Y"].val/100*canvas.height; // Y position of the rectangle's top-left corner
  const itemRadians = this.data[prefix+"Rot"].val/180*Math.PI;
    
  ctx.save();

    // Translate to the center of the rectangle
  ctx.translate(itemX + itemWidth / 2, itemY + itemHeight / 2);
  //ctx.translate(canvas.width / 2, canvas.height / 2);

    // Rotate the canvas
  ctx.rotate(itemRadians);
  //ctx.translate(-canvas.width / 2, -canvas.height / 2);
  ctx.font = this.data[prefix+"Scale"].val/100*canvas.height + "px" + " Arial";
  ctx.fillStyle = "black";
  ctx.fillText(this.data[prefix+"Text"].val,0,0);
  try{
      var image = this.data[prefix+"Image"].val;//img        
      ctx.drawImage(image,0,0, this.data[prefix+"Scale"].val/100*image.width, this.data[prefix+"Scale"].val/100*image.height)
  } catch(error){ }
  ctx.restore();     
    
  return canvas;
}


 magicFrame.drawRegistrationMarks = function(canvas){
    var insetPx= this.mmToPx(this.data.diameter.val);
    var bleed = this.mmToPx(this.data.bleed.val);
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "white";
    ctx.lineWidth = insetPx*2;
    ctx.strokeRect(insetPx,insetPx,canvas.width-insetPx*2, canvas.height - insetPx*2);
     
    ctx.fillStyle = "black";
    ctx.font =  insetPx*2 +"px arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("FRONT TOP "+(parseInt(this.data.width.val)+parseFloat(this.data.bleed.val)*2)+ "mm" ,canvas.width/2 ,insetPx);
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(0,0,canvas.width, canvas.height);
   
    //Add bleed
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Resize the original canvas
    canvas.width = canvas.width + bleed*2;
    canvas.height = canvas.height + bleed*2;
    // Redraw the stored content onto the resized canvas
    ctx.putImageData(imageData, bleed, bleed);
    ctx.strokeRect(0,0,canvas.width, canvas.height);
   
 }


magicFrame.draw = function(){
  //this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    
  //Images
  this.imagesCanvas = document.createElement("canvas");
  this.imagesCtx = this.imagesCanvas.getContext("2d");
  var canvas = this.drawPrefixInsideHoles("state1");
  this.imagesCanvas.width = canvas.width;
  this.imagesCanvas.height = canvas.height;
  this.imagesCtx.drawImage(canvas,0,0); 
  canvas = this.drawPrefixInsideHoles("state2");
  var shiftPx = this.mmToPx(this.data.diameter.val);
  this.imagesCtx.drawImage(canvas,shiftPx,0); 
  magicFrame.drawRegistrationMarks(this.imagesCanvas);
  
  //screen
  this.screenCanvas = this.makeHolesCanvas();
  this.screenCtx = this.screenCanvas.getContext("2d");
  this.screenCtx.globalCompositeOperation = 'source-out';
  this.screenCtx.fillStyle = "black";
  this.screenCtx.fillRect(0,0,this.screenCanvas.width, this.screenCanvas.height);
  this.screenCtx.globalCompositeOperation = 'source-over';
  magicFrame.drawRegistrationMarks(this.screenCanvas);
  var bleed = this.mmToPx(this.data.bleed.val);
  this.screenCtx.strokeRect(this.screenCanvas.width-bleed-shiftPx,bleed,bleed,this.screenCanvas.height-bleed*2);
  
  //full page
  this.fullPageCanvas = document.createElement("canvas");
  this.fullPageCanvas.id = "fullPageCanvas";
  this.fullPageCtx = this.fullPageCanvas.getContext("2d");
  this.fullPageCanvas.width = this.screenCanvas.width;
  this.fullPageCanvas.height = this.screenCanvas.height*2+10;
  
  this.fullPageCtx.drawImage(this.imagesCanvas,0,0);
  this.fullPageCtx.drawImage(this.screenCanvas,0, this.imagesCanvas.height + 10);
  
  document.getElementById("fullPageCanvas").remove();
  document.body.append(this.fullPageCanvas);
  //document.body.append(this.screenCanvas);
}

magicFrame.update = function(){
  
  this.draw();
};

magicFrame.init = function(){
  magicFrame.makeGui();  
  var event = new Event('change');
   document.getElementById("exampleFilesSelect").dispatchEvent(event);
}

//App.build(magicFrame);
//magicFrame.update();




  
    
  