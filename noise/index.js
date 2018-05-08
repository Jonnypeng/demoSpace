var app = new PIXI.Application(640,1030,{backgroundColor:0x000000});
document.getElementById("box").append(app.view);

var loader = new PIXI.loaders.Loader();
loader.add(["images/COVER.png","images/info.png"]);
loader.on("progress",function (lod){
	document.getElementById("num").innerHTML = lod.progress + "%";
});
loader.load(start);

function start(){
document.getElementById("preload").style.display = "none";
var cover = new PIXI.Sprite.fromImage("images/COVER.png");
var noise_filter = new PIXI.filters.NoiseFilter();
noise_filter.noise = 1.5;

cover.filters = [noise_filter];

var interference = new PIXI.Container();

for(var i = 0;i < 5;i ++){
var shape = new PIXI.Graphics();
var y = Math.random()*640;
shape.lineStyle(5 + Math.random()*100,0x000000,0.5*Math.random())
.moveTo(0,y)
.lineTo(800,y);
interference.addChild(shape);
};

interference.filters = [noise_filter];

var mask = new PIXI.Graphics();
mask.beginFill(0xFFFFFF).drawCircle(0,0,250);
mask.x = 310;
mask.y = 364;

cover.mask = mask;
interference.mask = mask;

mask.interactive = true;
mask.on('pointerdown',start);
mask.on('pointermove',move);
mask.on('pointerup',end);

var info = new PIXI.Sprite.fromImage('images/info.png');
info.y = 1030 - 100;
function start(){
	this.drag = true;
};

function move(e){
	if(mask.drag){
		mask.position = e.data.global;
	}else{
		return 0;
	};
}

function end(){
	mask.drag = false;
};

TweenMax.to(cover,1,{
	alpha:0.7,
	yoyo:true,
	repeat:-1,
	ease:Linear.noneEase
});

TweenMax.set(interference,{
	y:0
});


TweenMax.to(interference,2,{
	y:600,
	repeat:-1
});



app.stage.addChild(cover,interference,mask,info);

app.ticker.add(function (){
	noise_filter.seed = Math.random();
});


};
