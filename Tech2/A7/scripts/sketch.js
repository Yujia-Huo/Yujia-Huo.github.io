/**
 * This is a basic TEMPLATE for developing applications with the HTML5 Canvas API.
 * 
 * The main drawing functionality is implemented within the canvasApp() function.
 * The canvasApp() function is called once the browser listens to the event that
 * loads the page. This is done by adding the event listerner "load":
 *          window.addEventListener("load", eventWindowLoaded, false);
 * 
 * Resources:
 *      https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 *      
 */

function canvasApp() {

    /**
     * Encapsulate within the following function anything that you want
     * to draw in your browser within the specified region allocated for canvas.
     */
    function drawScreen () {
        

    }

    // Specify the dimensions of the Canvas

    // const width = window.innerWidth;
    let width = 618;
    // const height = window.innerHeight;
    let height = 442;

    const canvas = document.getElementById("canvas");

    // Resize the Canvas element
    canvas.width = width;
    canvas.height = height;

    /**
     * This specification defines the 2d context type, whose API is implemented 
     * using the CanvasRenderingContext2D interface.
     * 
     * The CanvasRenderingContext2D interface, part of the Canvas API, provides the 
     * 2D rendering context for the drawing surface of a <canvas> element. It is used 
     * for drawing shapes, text, images, and other objects.
     * 
     * The 2D context represents a flat Cartesian surface whose origin (0,0) 
     * is at the top left corner, with the coordinate space having x values 
     * increasing when going right, and y values increasing when going down.
     * 
     * See:
     * 
     *      https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
     */

    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "./assets/Screen Shot 2023-03-25 at 7.42.48 PM.png";

    var shapes = [];
    const shape1 = new Image();
    shape1.crossOrigin = "anonymous";
    shape1.src = "./assets/data/1.svg";

    const shape2 = new Image();
    shape2.crossOrigin = "anonymous";
    shape2.src = "./assets/data/2.svg";

    const shape3 = new Image();
    shape3.crossOrigin = "anonymous";
    shape3.src = "./assets/data/3.svg";

    const shape4 = new Image();
    shape4.crossOrigin = "anonymous";
    shape4.src = "./assets/data/4.svg";

    const shape5 = new Image();
    shape5.crossOrigin = "anonymous";
    shape5.src = "./assets/data/5.svg";

    const shape6 = new Image();
    shape6.crossOrigin = "anonymous";
    shape6.src = "./assets/data/6.svg";

    const shape7 = new Image();
    shape7.crossOrigin = "anonymous";
    shape7.src = "./assets/data/7.svg";

    const shape8 = new Image();
    shape8.crossOrigin = "anonymous";
    shape8.src = "./assets/data/8.svg";

    const shape9 = new Image();
    shape9.crossOrigin = "anonymous";
    shape9.src = "./assets/data/9.svg";

    const shape10 = new Image();
    shape10.crossOrigin = "anonymous";
    shape10.src = "./assets/data/10.svg";

    const shape11 = new Image();
    shape11.crossOrigin = "anonymous";
    shape11.src = "./assets/data/11.svg";

    const shape12 = new Image();
    shape12.crossOrigin = "anonymous";
    shape12.src = "./assets/data/12.svg";



    shapes.push(shape1);
    shapes.push(shape2);
    shapes.push(shape3);
    shapes.push(shape4);
    shapes.push(shape5);
    shapes.push(shape6);
    shapes.push(shape7);
    shapes.push(shape8);
    shapes.push(shape9);
    shapes.push(shape10);
    shapes.push(shape11);
    shapes.push(shape12);


    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawMosaic();
      };
  
    function drawMosaic() {

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        for (let gridX = 0; gridX < img.width; gridX++) {
            for (let gridY = 0; gridY < img.height; gridY++) {
                const tileWidth = 618 / img.width;
                const tileHeight = 442 / img.height;
                const posX = tileWidth * gridX;
                const posY = tileHeight * gridY;

                  console.log(img.width);
    
                const pixelIndex = (gridY * img.width + gridX) * 4;

                const c = imgData.data.slice(pixelIndex, pixelIndex + 4);

                const greyscale = Math.round(c[0] * 0.222 + c[1] * 0.707 + c[2] * 0.071);
          const gradientToIndex = Math.round(map(greyscale, 0, 255, 0, shapes.length - 1));

          ctx.drawImage(shapes[gradientToIndex], posX, posY, tileWidth, tileHeight);

        //   console.log(tileWidth);
        //   console.log(tileHeight);
      
            }
        }

    function map(value, start1, stop1, start2, stop2) {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
      }
    }
  
  
    // console.log(shapes);

    // ctx.drawImage(img, 0, 0);
    // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // const data = imageData.data;
    // console.log(data);
    // for (let i = 0; i < data.length; i += 4) {
    //     const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    //     data[i] = avg; // red
    //     data[i + 1] = avg; // green
    //     data[i + 2] = avg; // blue
    // }
    // ctx.putImageData(imageData, 0, 0);

    



    
    // for (var gridX = 0; gridX < img.width; gridX++) {
    //     for (var gridY = 0; gridY < img.height; gridY++) {
    //       // grid position + title size
    //       var titleWidth = 603 / img.width;
    //       var titleHeight = 873 / img.height;
    //       var posX = titleWidth * gridX;
    //       var posY = titleHeight * gridY;
    
    //       // get current color
    //     //   img.loadPixels();
    //     //   var c = data.get(min(gridX, img.width - 1), gridY);
    //       // greyscale conversion
    //     //   var greyscale = round(red(c) * 0.222 + green(c) * 0.707 + blue(c) * 0.071);
    //       var gradientToIndex = round(map(greyscale, 0, 255, 0, shapes.length - 1));
    //       image(shapes[gradientToIndex], posX, posY, titleWidth, titleHeight);
    //       ctx.putImageData(imageData, 0, 0);
    //     }
    //   }


    // Call the drawScreen() function at the end of the main canvasApp()
    drawScreen();

}

window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded () {
    canvasApp();
}

eventWindowLoaded();
