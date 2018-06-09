var app = new PIXI.Application(640,1030,{backgroundColor:0x000000});

var loader = new PIXI.loaders.Loader();
loader.add(["images/complete.jpg","images/football.png","images/footballField.jpg"]);
loader.on("progress",function (lod){
	document.getElementById("num").innerHTML = Math.floor(lod.progress) + "%";
});
loader.load(start);

function start(){
	document.getElementById("preload").style.display = "none";

	const engine = Matter.Engine.create();
	const Engine = Matter.Engine;
	const World = Matter.World;
	const world = engine.world;
	const Bodies = Matter.Bodies;
	const Composite = Matter.Composite;
	const Render = Matter.Render;
	const Runner = Matter.Runner;
	var render;
	var ready = false;


	var cirs = [];

	class cir{
		constructor(x,y,radius,texture,options){
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.texture = texture;
			this.options = options;
			this.create();
		}
		create(){
			return {
				'body':this.createBody(),
				'sprite':this.createSprite()
			}
		}
		createBody(){
			this.body = Bodies.circle(this.x,this.y,this.radius,this.options);
			World.add(world,this.body);
		}
		createSprite(){
			this.sprite = new PIXI.Sprite(this.texture);
			this.sprite.pivot.x = 50;
			this.sprite.pivot.y = 50;
			this.sprite.x = this.x;
			this.sprite.y = this.y;
			app.stage.addChild(this.sprite);
		}
		render(){
				this.sprite.position.set(
					this.body.position.x,
					this.body.position.y
				);
				this.sprite.rotation = this.body.angle;
		}
	}

	class wall{
		constructor(x,y,w,h,color,options){
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.color = color;
			this.options = options;
			this.create();
		}
		create(){
			return {
				'body':this.createBody(),
				'graphics':this.createGraphics()
			}
		}
		createBody(){
			this.body = Bodies.rectangle(this.x,this.y,this.w,this.h,this.options);
			World.add(world,this.body);
		}
		createGraphics(){
			this.graphics = new PIXI.Graphics();
			this.graphics.pivot.x = this.w * 0.5;
			this.graphics.pivot.y = this.h * 0.5;
			this.graphics.beginFill(this.color).drawRect(this.x,this.y,this.w,this.h);
			app.stage.addChild(this.graphics);
		}
	}



	var game = {
		'init':function (){
			/*render = Render.create({
				canvas:document.getElementById('matter'),
				engine:engine,
				options:{
					width:640,
					height:1030
				}
			});*/

			var runner = Runner.create();
			Runner.run(runner,engine);
			Engine.run(engine);
			//Render.run(render);

			$("#box").append(app.view);
			game.view();
		},
		'view':function (){
			var bg = new PIXI.Sprite.fromImage("images/footballField.jpg");
			app.stage.addChild(bg);
			var left = new wall(-5,515,10,1030,0xff0000,{isStatic:true});
			var right = new wall(645,515,10,1030,0xff0000,{isStatic:true});
			var bottom = new wall(320,1035,1030,10,0xff0000,{isStatic:true});

			app.stage.interactive = true;
			app.stage.on("pointertap",function (){
					console.log(ready);
				if(ready){
					bottom.body.isStatic = false;
					ready = false;
					bg.texture = PIXI.Texture.fromImage("images/complete.jpg");
				}else{
					return false;
				};
			});

			game.tick();
		},
		'tick':function (){
			var count = 0;

			function makeCir(){
				count++;
				if(count % 10 == 0){
					count = 0;
					cirs.push(new cir(
						Matter.Common.random(50,590),
						0,
						50,
						PIXI.Texture.fromImage('images/football.png'),
						{friction:0.8,restitution:0.5}
					));
			}else{
				return false;
			};
			if(cirs.length>=70){
				app.ticker.remove(makeCir);
				ready = true;
			}
			};

			app.ticker.add(update);
			app.ticker.add(makeCir);
			function update(){
				cirs.forEach(function (p,i,arr){
					p.render();
				});
			}
		}
	};

	game.init();
};
