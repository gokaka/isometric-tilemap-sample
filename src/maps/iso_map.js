(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("Isometric_32x16_nooffset_csv",
{ "height":9,
 "layers":[
        {
         "data":[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         "height":9,
         "name":"WhiteNGrey_Layer_0",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"isometric",
 "properties":
    {
     "interactive":"true"
    },
 "propertytypes":
    {
     "interactive":"string"
    },
 "renderorder":"right-down",
 "tiledversion":"1.0.3",
 "tileheight":16,
 "tilesets":[
        {
         "columns":2,
         "firstgid":1,
         "image":"..\/Game\/TiledMap\/phaser-tiled\/testmaps\/maps\/gfx\/png\/32x16\/white_grey_xoffset_0__yoffset_0.png",
         "imageheight":16,
         "imagewidth":64,
         "margin":0,
         "name":"white_grey_xoffset_0__yoffset_0",
         "spacing":0,
         "tilecount":2,
         "tileheight":16,
         "tilewidth":32,
         "transparentcolor":"#ff00ff"
        }],
 "tilewidth":32,
 "type":"map",
 "version":1,
 "width":11
});