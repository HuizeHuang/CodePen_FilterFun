var image_gray = null;
var image_red = null;
var image_rainbow = null;
var image_blur = null;
var image = null;
var can;

function upload(){
  can = document.getElementById("can");
  var file = document.getElementById("file");
  image = new SimpleImage(file);
  image_gray = new SimpleImage(file);
  image_red = new SimpleImage(file);
  image_rainbow = new SimpleImage(file);
  image_blur = new SimpleImage(file);
  image.drawTo(can);
}

function imageIsLoaded(image){
  if(image == null || !image.complete()){
    alert("image not uploaded!");
    return false;
  }
  else{
    return true;
  }
}
function filterGray(){
  for(var pixel of image_gray.values()){
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
}
function doGray(){
  if(imageIsLoaded(image_gray)){
    filterGray();
    image_gray.drawTo(can);
  }
}
function filterRed(){
  for(var pixel of image_red.values()){
    colorFilter(255,0,0,pixel);
  }
}
function doRed(){
  if(imageIsLoaded(image_red)){
    filterRed();
    image_red.drawTo(can);
  }
}
function colorFilter(Rc,Gc,Bc,pixel){
  var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
  if(avg < 128){
      pixel.setRed(Rc/127.5 * avg);
      pixel.setGreen(Gc/127.5 * avg);
      pixel.setBlue(Bc/127.5 * avg);
    }
    else{
      pixel.setRed((2 - Rc/127.5)*avg + 2*Rc - 255);
      pixel.setGreen((2 - Gc/127.5)*avg + 2*Gc - 255);
      pixel.setBlue((2 - Bc/127.5)*avg + 2*Bc - 255);
    }
}
function filterRainbow(){
  var strip = image_rainbow.getHeight()/7;
  for(var pixel of image_rainbow.values()){
    var y = pixel.getY();
    if(y<strip){
      colorFilter(255,0,0,pixel);
    }
    if(y >= strip && y < 2*strip){
      colorFilter(255,165,0,pixel);
    }
    if(y >= 2*strip && y < 3*strip){
      colorFilter(255,255,0,pixel);
    }
    if(y >= 3*strip && y < 4*strip){
      colorFilter(0,255,0,pixel);
    }
    if(y >= 4*strip && y < 5*strip){
      colorFilter(0,0,255,pixel);
    }
    if(y >= 5*strip && y < 6*strip){
      colorFilter(75, 0, 130,pixel);
    }
    if(y >= 6*strip){
      colorFilter(128,0,128,pixel);
    }
  }
}
function doRainbow(){
  if(imageIsLoaded(image_rainbow)){
    filterRainbow();
    image_rainbow.drawTo(can);
  }
}
function filterBlur(){
  var output = new SimpleImage(image_blur.getWidth(), image_blur.getHeight());
  for(var pixel of image_blur.values()){
    var x = pixel.getX();
    var y = pixel.getY();
    var pixel_blur;
    if(Math.random()<0.5){
      output.setPixel(x,y,pixel);
    }
    else{
      var x_random = Math.floor((Math.random() * 10));
      var y_random = Math.floor((Math.random() * 10));
      if(x - x_random < 0 || y - y_random < 0 || x - x_random > output.getWidth() || y - y_random > output.getHeight() ){
          if (x === 0 && y === 0){
              pixel_blur = image_blur.getPixel(x,y+1);
          }
        else if (x === 0){
          pixel_blur = image_blur.getPixel(x,y-1);
          output.setPixel(x, y, pixel_blur);   
        }
        else{
            if(Math.random()<0.5){
                pixel_blur = image_blur.getPixel(x-1,y);
            output.setPixel(x, y, pixel_blur);
            }
            else{
                if(x!=image_blur.getWidth()-1){
                  pixel_blur = image_blur.getPixel(x+1,y);
                  output.setPixel(x, y, pixel_blur);
                }
            }
        }
      }
      else{
         pixel_blur = image_blur.getPixel(x-x_random, y-y_random)
        output.setPixel(x, y, pixel_blur);
      }
    }
  }
  return output;
}
function doBlur(){
  if(imageIsLoaded(image_blur)){
    var output = filterBlur();
    output.drawTo(can);
  }
}
function copyImage(image_color){
  for(var pixel of image_color.values()){
    image_color.setPixel(pixel.getX(),pixel.getY(),pixel);
  }
}

function reset(){
  if(imageIsLoaded(image)){
    image.drawTo(can);
    copyImage(image_gray);
    copyImage(image_red);
    copyImage(image_rainbow);
    copyImage(image_blur);
  }
}