var app = new PIXI.Application(640,1030,{backgroundColor:0x000000});
document.getElementById("box").append(app.view);

var loader = new PIXI.loaders.Loader();
loader.add(["images/info.jpg","images/color.jpg","images/blackWhite.jpg","images/complete.png"]);
loader.on("progress",function (lod){
	document.getElementById("num").innerHTML = lod.progress + "%";
});
loader.load(start);

function start(){
document.getElementById("preload").style.display = "none";

	var game = {
			'init':function (){
				var info = new PIXI.Sprite.fromImage('images/info.jpg');
				app.stage.addChild(info);

				info.interactive = true;

				var rect = new PIXI.Rectangle(132,596,396,191);

				info.on("pointertap",function (e){
					var hit = rect.contains(e.data.global.x,e.data.global.y);
					if(hit){
						info.interactive = false;
						info.destroy();
						game.start();
					}
				});
			},
			'start':function (){
				 var black = new PIXI.Sprite.fromImage('images/blackWhite.jpg');
				 var color = new PIXI.Sprite.fromImage('images/color.jpg');
				 var complete =  new PIXI.Sprite.fromImage('images/complete.png');

				 TweenMax.set(complete,{alpha:0});
				 var mask = new PIXI.Graphics();
				 mask.beginFill(0xFFFFFF).drawCircle(0,0,0);

				 color.mask = mask;

				 app.stage.addChild(black,color,complete,mask);

				 app.stage.interactive = true;
				 app.stage.on('pointerdown',start);
				 app.stage.on('pointermove',move);
				 app.stage.on('pointerup',end);

				 var count = 0;

				 var rects = [];
				 var shape = new PIXI.Graphics();app.stage.addChild(shape);

				 for(var i = 0;i < 1648;i++){
					 var x = i*20;
					 x = x % 640;
					 var y = (Math.floor( i*20 / 640))*20;
					 var rect = new PIXI.Rectangle(x,y,20,20);
					 rect.hit = false;
					 rects.push(rect);
					 test(x,y);
				 }

				 function test(x,y){
					 shape.lineStyle(1,0xFFFFFF,0.1).drawRect(x,y,20,20);
				 };

				 function start(){
					 this.drag = true;
				 };


				 function move(e){
					 if(app.stage.interactive){
							rects.forEach(function (p){
								if(p.contains(e.data.global.x,e.data.global.y)){
									if(p.hit==false){
									p.hit = true;
									count++;
									console.log(count);
									}
								}
	 					 });
						 	mask.beginFill(0xFFFFFF).drawCircle(e.data.global.x,e.data.global.y,20);
					 }else{
						 return 0;
					 };
				 };


				 function end(){
					 app.stage.drag = false;
					 if(count >= 1000){
						 TweenMax.to(complete,1,{
							 alpha:1,
							 onComplete:function (){
								 mask.beginFill(0xFFFFFF).drawRect(0,0,640,1030);
								 complete.alpha = 0;
								 shape.alpha = 0;
								 app.stage.interactive = false;
							 }
						 });
					 }else{
						 console.log('no');
					 }
				 };

			}
	};

	game.init();
};
