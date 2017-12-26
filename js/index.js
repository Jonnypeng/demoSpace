window.addEventListener('load',main,false);

function main(){
	var manifest = ['images/icon.jpg','images/preloadBg.jpg'];
  var app = new PIXI.Application(640,1030);
  $('#box').append(app.view);

	var loader = new PIXI.loaders.Loader();
	loader.add(manifest);

	loader.on('progress',function (load,res){
		$('#num').html(Math.floor(load.progress) + '%');	
	});

	loader.load(function (){
		$('#preload').hide();
		start(app);
	});
};

function start(app){
	
}
