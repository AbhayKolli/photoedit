

/**
 * 1. put the three buttons in a div
 * 2.do not let corp frame go out of canvas

 * 



 * 
*/
const input=document.getElementById("submission")
const container=  document.getElementById("container")
let cropMode=false
function drawImage(){
    const curFile= input.files[0]
   

    //
    const canvas = document.createElement("canvas")
    canvas.height=500
    canvas.width=500
    canvas.id="canvas"
    const ctx = canvas.getContext("2d")

    const image= new Image()

    image.addEventListener("load", () => {
        ctx.drawImage(image, 0, 0,500,500);
        ctx.save()        
      });
    
    image.src = URL.createObjectURL(curFile);
    

    //


    const filterButton = document.createElement("select")
    let HTML=`<option value=${""} disabled selected hidden>Filter</option>`
    HTML+=`<option value=${"BW"}>B/W</option>`
    HTML+=`<option value=${"Sepia"}>Sepia</option>`
    filterButton.innerHTML=HTML
    filterButton.id="filterdrop"

    const cropButton = document.createElement("button")
    cropButton.innerText="Crop"
    cropButton.id="cropbutt"

    const cropConfirm = document.createElement("button")
    cropConfirm.innerText="Done"
    cropConfirm.id="cropconf"
    cropConfirm.style.visibility="hidden"
    

    const brushButton = document.createElement("button")
    brushButton.innerText="Brush"
    brushButton.id="brush"
    const eraserButton = document.createElement("button")
    eraserButton.innerText="Eraser"
    eraserButton.style.visibility="hidden"
    eraserButton.id="eraser"
    const donePaint = document.createElement("button")
    donePaint.style.visibility="hidden"
    donePaint.innerText="Done"
    donePaint.id="done"

    const  buttonHolder= document.createElement("div")
    buttonHolder.id="holder"
    buttonHolder.appendChild(filterButton)
    buttonHolder.appendChild(cropButton)
    buttonHolder.appendChild(cropConfirm)
    buttonHolder.appendChild(brushButton)
    buttonHolder.appendChild(eraserButton)
    buttonHolder.appendChild(donePaint)



    const exportButton=document.createElement("button")
    exportButton.innerText="Save"
    exportButton.id="export"

    const resetButton=document.createElement("button")
    resetButton.innerText="Reset"
    resetButton.id="reset"

      resetButton.addEventListener("click",(e)=>{
        
        ctx.drawImage(image, 0, 0,500,500);
        ctx.drawImage(image, 0, 0,500,500);
        ctx.restore()


      })
    buttonHolder.appendChild(exportButton)
    buttonHolder.appendChild(resetButton)


    exportButton.addEventListener("click",(e)=>{
        let canvasUrl = canvas.toDataURL();
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;
    
        createEl.download = "download-this-canvas";
    
        createEl.click();
        createEl.remove();
    })

    

    //

    const imageDrawn=new Event("drawn")

    container.appendChild(canvas)

    // container.appendChild(filterButton)
    // container.appendChild(cropButton)
    // container.appendChild(cropConfirm)
    // container.appendChild(brushButton)
    // container.appendChild(eraserButton)
    // container.appendChild(donePaint)
    // container.appendChild(exportButton)
    // container.appendChild(resetButton)
    container.appendChild(buttonHolder)

    container.dispatchEvent(imageDrawn)
    

    

    
}

input.addEventListener("change",(e)=>{
    console.log("file input event")
    if (container.hasChildNodes()){
        container.innerHTML=''
    }
    drawImage()



});
container.addEventListener("drawn",(e)=>{
    console.log("image drawn event")
    const filter= document.getElementById("filterdrop")
    const cropButton = document.getElementById("cropbutt")
    const brushButton=document.getElementById("brush")
    if(filter){
        
        filter.addEventListener("change",(e)=>{
            console.log("filter event")
            applyFilter(filter.value)
            
            
        })
        cropButton.addEventListener("click",(e)=>{
            console.log("clicked")
            if (document.getElementById("cropframe")==null){
                applyCropFrame()

            }
            
        })

        brushButton.addEventListener("click",(e)=>{
            brushButton.style.visibility="hidden"
            applyPaintMode()
        }
        )

        
    }

    


})

function applyPaintMode(){
    const resetButton=document.getElementById("reset")
    resetButton.style.visibility="hidden"
    const cropButton=document.getElementById("cropbutt")
    cropButton.style.visibility="hidden"
    console.log("in paint mode")
    let eraseMode=false

    const eraserButton=document.getElementById("eraser")
    eraserButton.style.visibility="visible"
    const doneButton=document.getElementById("done")
    const brushButton=document.getElementById("brush")
    const canvas1= document.getElementById("canvas")
    let ctx1= canvas1.getContext("2d")
    if(eraseMode){
        eraserButton.style.backgroundColor="yellow"
    }
    else{
        eraserButton.style.backgroundColor=""
    }


    doneButton.style.visibility="visible"

    const canvas2=document.createElement("canvas")
    canvas2.id="canvas2"
    canvas2.width=500;
    canvas2.height=500;
    const ctx2=canvas2.getContext("2d")
    ctx2.clearRect(0,0,500,500)
    container.appendChild(canvas2)
    
    let t1=0
    let t2=0
    function bcd(e){


        const x = e.clientX - t1;
        const y = e.clientY - t2;
        ctx2.lineTo(x,y)
        ctx2.stroke()
        // console.log(x,y)
        // ctx2.fillStyle="red"
        // ctx2.fillRect(x,y,5,5)
    }
    function def(e){
        const x = e.clientX - t1;
        const y = e.clientY - t2;
        ctx2.clearRect(x,y,10,10)


    }
    canvas2.addEventListener("mousedown",(e)=>{
        const bounding = e.target.getBoundingClientRect();
            t1=bounding.left
            t2=bounding.top
            const x = e.clientX - bounding.left;
            const y = e.clientY - bounding.top;
        if(!eraseMode){
            
            // console.log(x,y)
            // ctx2.fillStyle="red"
            // ctx2.fillRect(x,y,5,5)
            ctx2.lineWidth=2
            ctx2.beginPath()
            ctx2.moveTo(x,y)
            canvas2.addEventListener("mousemove",bcd)
            canvas2.addEventListener("mouseup",(e)=>{
                console.log('drawing finished')
                canvas2.removeEventListener("mousemove",bcd)
            })
        
    

        }
        else{
            canvas2.addEventListener("mousemove",def)
            canvas2.addEventListener("mouseup",(e)=>{
                console.log("erased")
                canvas2.removeEventListener("mousemove",def)  
            })


        }



    })

    doneButton.addEventListener("click",(e)=>{
        resetButton.style.visibility="visible"
        cropButton.style.visibility="visible"
        brushButton.style.visibility="visible"
        eraseMode=false
        // var img= canvas.toDataURL()
        const image= new Image()
        image.src=canvas1.toDataURL()
        image.addEventListener("load",(e)=>{
            ctx1.drawImage(image,0,0)
            ctx1.drawImage(canvas2,0,0)
            canvas2.remove()
            
        })

        doneButton.style.visibility="hidden"
        eraserButton.style.visibility="hidden"
        eraserButton.removeEventListener("click",eraserSwitch)
    })

    function eraserSwitch(e){
        

        eraseMode=!eraseMode
        if(eraseMode){
            eraserButton.style.backgroundColor="yellow"
        }
        else{
            eraserButton.style.backgroundColor=""
        }
    }
    eraserButton.addEventListener("click",eraserSwitch)

    


}



function applyFilter(filterName){
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const img= new Image()
    img.src=canvas.toDataURL()

    img.onload = () => {
        ctx.drawImage(img, 0, 0,canvas.width,canvas.height);
        if(filterName==="BW"){

            ctx.drawImage(img, 0, 0,canvas.width,canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg; // red
              data[i + 1] = avg; // green
              data[i + 2] = avg; // blue
            }
            ctx.putImageData(imageData, 0, 0);
        }
        if(filterName==="Sepia"){
    
            ctx.drawImage(img,0,0,canvas.width,canvas.height)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data
            for (let i = 0; i < data.length; i += 4) {
                let originalRed=data[i]
                let originalGreen=data[i+1]
                let originalBlue=data[i+2]
                data[i] = 0.393*data[i]+0.769*data[i+1]+0.189*data[i+2]; // red
                data[i + 1] =.349 * originalRed + .686 * originalGreen + .168 * originalBlue; // green
                data[i + 2] = .272 * originalRed + .534 * originalGreen + .131 * originalBlue; // blue
              }
            ctx.putImageData(imageData, 0, 0);
    
        }
    
    
    
      };



    

}


function applyCropFrame(){
    const cropButton=document.getElementById("cropbutt")
    cropButton.style.visibility="hidden"
    
    const brushButton=document.getElementById("brush")
    brushButton.style.visibility="hidden"
    console.log("cropping")
    const resizeBox=document.createElement("div")
    resizeBox.id="resizehandle"

    const cropconf= document.getElementById("cropconf")
    cropconf.style.visibility="visible"
    
    const cropFrame=document.createElement("div")
    cropFrame.id="cropframe"
    
    
    



    function abc(e){
        pos1=pos3-e.clientX
        pos2=pos4-e.clientY
        pos3=e.clientX
        pos4=e.clientY
        
        cropFrame.style.top=(cropFrame.offsetTop-pos2 ) + "px"
        cropFrame.style.left=(cropFrame.offsetLeft - pos1) + "px"


    
    }
    cropFrame.addEventListener("mousedown",(e)=>{
        console.log("dragging start")
        cropFrame.addEventListener("resize",(e)=>{
            console.log("resizing")
        })
        var rect = e.target.getBoundingClientRect();
        var x = rect.right-e.clientX
        
        var y = rect.bottom-e.clientY
        console.log(x,y)
        pos3=e.clientX
        pos4=e.clientY
        if(!( x<=17 && y<=17)){
            cropFrame.addEventListener("mousemove",abc
            )
        }


        
    })
    cropFrame.addEventListener("mouseup",(e)=>{
        console.log("dragging stop")
    
        cropFrame.removeEventListener("mousemove",abc)
    })

    cropconf.addEventListener("click",(e)=>{
        console.log("workgin")
            brushButton.style.visibility="visible"
            cropButton.style.visibility="visible"
            let sx=cropFrame.offsetLeft
            let sy=cropFrame.offsetTop

            let dx=0
            let dy=0
            const canvas=document.getElementById("canvas")
            const ctx = canvas.getContext("2d")
            let dWidth=canvas.width
            let dHeight=canvas.height

            const image= new Image()
            image.id="pic"
            image.src=canvas.toDataURL()
            
            image.addEventListener("load", () => {
                let sWidth=parseInt(cropFrame.style.width,10)
                let sHeight=parseInt(cropFrame.style.height,10)
                ctx.clearRect(0,0,canvas.width,canvas.height)
                if(sWidth && sHeight){
                    ctx.drawImage(image,sx,sy,sWidth,sHeight,0,0,canvas.offsetWidth,canvas.offsetHeight)

                }
                else{
                ctx.drawImage(image,sx,sy,100,100,0,0,canvas.offsetWidth,canvas.offsetHeight)

                }
                
                  
            });
            cropconf.style.visibility="hidden"
       
            cropFrame.remove()
            
    })

    cropFrame.appendChild(resizeBox)
    container.appendChild(cropFrame)

    
    
}































