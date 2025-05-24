class App{
      //each data property must contain templateId property to have a gui for it
      //data.props.prop name must match that used in its intended template
      //Templates include the App.eventHandler and pass it any prop name it needs to set
      //Templates can include a bound attribute of the form "prop, attribute"
      
      
      //App.build(app) goes through data and build the gui from its templates
      //it gives each gui a props attribute so the event handler can retreive its related data.props
      //it gives each data.props a bound attribute so that the eventHandler can update all of its bound gui elements
     // It gives each data.props a bound that is the update function to the event handler can call it at the end
      
      constructor(){
        this.data = {};
        //this.gui = {};
      }
      
      static setter(props,prop, val){
      
         if(val instanceof File){           
           let fr = new FileReader();     
           fr.readAsDataURL(val);
           fr.onload = function () {
            props[prop] = new Image;
            props[prop].src = fr.result;
            props[prop].onload  = function () {
              if(updateFunction!= null){
                 updateFunction();
              }
            }
          }
         }
        
        else{
          props[prop] = val;
        }
        
        //set its bound gui elements
        var updateFunction;
        for(var i =0; i< props.bound.length; i++){
          var bound = props.bound[i];
          if(typeof bound === "object"){
            if(bound.element[bound.attribute] != props[bound.prop]){
              bound.element[bound.attribute] = props[bound.prop];
            }
          }
          
          if(typeof bound === "function"){
            updateFunction = bound;//set aside for the end
          }
                      
        }
        
        
        if(updateFunction!= null){
          if(typeof val != "file"){
            updateFunction();
          }          
        }
      }
  
      //templates all must use this event handler
      static eventHandler(element, prop){
        var container = element.parentNode.closest('.container');
        var props = container.props;
        //update data
        if(element.type === "file"){
          this.setter(props,prop, element.files[0]);          
        }
        else{
          this.setter(props,prop, element.value);
        }
        
      }
  
  
  
      
      
      
      static build(app){
        for (var key in app.data){
          var props = app.data[key];
          var template = document.getElementById(props.templateId).innerHTML;
          for(var prop in props){
            template = template.replaceAll("{"+prop+"}", props[prop]);
          }
          var div = document.createElement("div");
          document.getElementById(props.parentId).append(div);
          div.innerHTML = template;
          div.classList.add("container");
          //add props to the gui element so that you can access it in the event handler to set a prop within it
          div.props = props;
          //Data to gui binding. Add bound gui elements to a list in data.
          var boundElements = div.querySelectorAll('[bound]');
          props.bound = [];
          for(var i=0; i<boundElements.length; i++){
            var bound = boundElements[i].getAttribute("bound").split(",");
            props.bound.push({element: boundElements[i], prop: bound[0], attribute: bound[1]});
          }
          //add the apps update fuction to the each data.props
          if(app.update){ 
            props.bound.push(app.update.bind(app));
          }
          
        }
      }
  
      static duplicateData(data, oldPrefix, newPrefix, swaps){
        for(var key in data){
          if(key.includes(oldPrefix)=== true){
            var string = JSON.stringify(data[key]);
            if(swaps){
              for(var i = 0; i<swaps.length; i++){
                string = string.replaceAll(swaps[i][0],swaps[i][1]);
              }
            }            
            data[key.replaceAll(oldPrefix,newPrefix)] = JSON.parse(string);
            //console.log(JSON.parse(JSON.stringify(data[key])));
          }
        }
      }
  
     static modifyData(data){
       
     }
      
  
     static downloadFile(name, href){
       var tmpLink = document.createElement( 'a' );  
       tmpLink.download = name; // set the name of the download file 
       tmpLink.href = href;  
  
       // temporarily add link to body and initiate the download  
       document.body.appendChild( tmpLink );  
       tmpLink.click();  
       document.body.removeChild( tmpLink ); 
     }

   }