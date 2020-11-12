
const { createCanvas, Image } = require('canvas');

const canvas = createCanvas(572, 512);
const ctx = canvas.getContext('2d');
const imageURL = 'https://4emlmvx17b.execute-api.us-east-1.amazonaws.com/demo/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=false&LAYERS=ABI-L2-CMIPF/2020/317/12/OR_ABI-L2-CMIPF-M6C09_G16_s20203171250156_e20203171259470_c20203171259554.tif&STYLES=cloud_moisture&WIDTH=572&HEIGHT=512&CRS=EPSG:3857&BBOX=-9289850.66966718,3023779.413210192,-8311456.707616924,3899442.009245171';
const img = new Image();
img.onload = () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
img.src = imageURL;
