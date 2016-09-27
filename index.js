'use strict';

var assign      = require('object-assign');
var pathFn      = require('path');
var hexo_env    = require('hexo-env');
var ic          = require('./lib/copyAssets.js');
var lg          = require('./lib/log.js');
var isEnableAMP = true;

lg.setConfig(hexo.config);
ic.setConfig(hexo.config);

if(hexo.config.generator_amp && hexo.config.generator_amp.onlyForDeploy){
	isEnableAMP = hexo.config.generator_amp.onlyForDeploy && (hexo_env.env(hexo) == 'production');
}

if( isEnableAMP ){

	//default path
	var ejsPath     = '../template/sample-amp.ejs';
	var cssPath     = '../template/sample-amp.css';
	var logoPath    = '../template/sample-logo.png';
	var sitelogoPath= '../template/sample-yoursite-logo.png';
	var avatorPath  = '../template/sample-avator.png';
	var substituteTitleImagePath    = '../template/sample-substituteTitleImage.png';

	//------------------------------------
	// copy template file
	//------------------------------------
	if(hexo.config.generator_amp && hexo.config.generator_amp.templateDir && hexo.config.generator_amp.assetDistDir && hexo.config.generator_amp.logo && hexo.config.generator_amp.logo.path && hexo.config.generator_amp.substituteTitleImage && hexo.config.generator_amp.substituteTitleImage.path){
		ic.initCopy( pathFn.join(hexo.config.generator_amp.templateDir) , [ejsPath, cssPath, logoPath, sitelogoPath, substituteTitleImagePath, avatorPath]);
	}else{
		lg.log("error", "Please set the generator_amp option." , "_config.yml");
		return null;
	}

	var avatorDefaultPath = "sample/" + pathFn.basename( avatorPath );
	if(hexo.config.authorDetail && hexo.config.authorDetail.avatar && hexo.config.authorDetail.avatar.path){
		avatorDefaultPath = hexo.config.authorDetail.avatar.path;
	}

	var siteLogImagePath = "";
	if(hexo.config.generator_amp.logo_topImage && hexo.config.generator_amp.logo_topImage.path){
		siteLogImagePath = hexo.config.generator_amp.logo_topImage.path;
	}else{
		siteLogImagePath = hexo.config.generator_amp.logo.path;
	}

	var copyAssetsStatus  = ic.copyAssets(hexo.config.generator_amp.templateDir, hexo.config.generator_amp.assetDistDir, [hexo.config.generator_amp.logo.path, hexo.config.generator_amp.substituteTitleImage.path, avatorDefaultPath, siteLogImagePath]);
	if(!copyAssetsStatus)return null;



	hexo.config.generator_amp = assign({
		
	}, hexo.config.generator_amp, {
		"defaultAssetsPath" : {
			"ejs" : ejsPath ,
			"css" : cssPath ,
			"logo": logoPath ,
			"avator" : avatorPath ,
			"substituteTitleImage" : substituteTitleImagePath
		}
	});


	hexo.extend.generator.register('amp', require('./lib/generator'));
	hexo.extend.filter.register('after_post_render', require('./lib/eyeCatchVars') );
}