// var url = 'http://localhost/_projects-apps/5RA-v2/adminsystem/';
var url = 'http://lptsaraswati.com/adminsystem/';
	urlTarget = url + 'apps.php',
	table = [],
	lastTime = [],
	layout = '',
	onFinding = [];
	
onFinding = { scroll: { report: 0, summary: 0, chat: 0 }, new: { report: 0, summary: 0, chat: 0 } };
// table = { report: [], summary: [], chat: [] }
table = { report: [], summary: [], chat: [], reportYest: [], summaryYest: [] }


$( document ).ready( function(){
	getVersionCode();
	setRippleEffect();
	document.addEventListener('deviceready', deviceReady, false);
});

function animateLoading(){
	setTimeout( function(){
		var whiteScreen = $( '#white-screen' );
		whiteScreen.addClass( 'animate-opacity-lost' );
		setTimeout( function(){
			whiteScreen.hide();
		}, 500 );
	}, 1000 );
}

function getVersionCode(){
	var data = { m : 'getVersionCode' },
		onSuccess = function( nowVersion ){
			if( existLS( 'versionCode' ) ){
				var existVersion = getLS( 'versionCode' );
				if( existVersion != nowVersion ){
					clearLS_content();
				}
			}
			setLS( 'versionCode', nowVersion );
			getAppScript( 'apps.js' );
		};
	getX( data, onSuccess );
}

function showLoading(){
	var loading = $( '#loading' );
	loading.removeClass( 'animate-opacity-lost' );
	loading.show(); 
}

function hideLoading(){
	var loading = $( '#loading' );
	loading.removeClass( 'animate-opacity' );
	loading.addClass( 'animate-opacity-lost' );
	setTimeout(function(){ 
		loading.hide(); 
	}, 500);
}

function getX( sendData, onSuccess ){
	sendData.versionCode = getLS( 'versionCode' );
	$.ajax({
		url: urlTarget,
		traditional: true,
		type: 'post',
		dataType: 'text',
		data: sendData,
		error: ajax_err,
		success: onSuccess
	}); 
}

function setLS( name, val ){
	if( typeof name === 'string' )
		localStorage.setItem( name, val );
	else{
		
	}
}

function getLS( name ){
	return localStorage.getItem( name );
}

function delLS( name ){
	localStorage.removeItem( name );
}

function hasLogin(){
	return existLS( 'id_member' );
}

function tryAgain( msg ){ 
	alert( msg ); 
}

function existLS( name ){
	return ( getLS( name ) != undefined );
}

function ajax_err( jqXHR, exception ){
	if ( jqXHR.status === 0 ) { 
		tryAgain( 'Tidak ada koneksi\nPastikan koneksi anda aktif' );
	} else if ( jqXHR.status == 404 ) { 
		tryAgain( 'Halaman server tidak ditemukan [404]' ); 
	} else if ( jqXHR.status == 500 ) { 
		tryAgain( 'Internal Server Error [500]' ); 
	} else if ( exception == 'parsererror' ) { 
		tryAgain( 'Gagal pembacaan JSON yang diminta' ); 
	} else if ( exception == 'timeout' ) { 
		tryAgain( 'Koneksi terlalu lama' ); 
	} else if ( exception == 'abort' ) { 
		tryAgain( 'Koneksi ditolak' ); 
	} else { 
		tryAgain( 'Error :\n' + jqXHR.responseText ); 
	}
	hideLoading();
	animateLoading();
}

function parseIq( text, sep = null ){
	if( !sep ) sep = '<#SEPARATOR#114#>';
	return text.split( sep );
}

function parseJSON( text ){
	try{
		text = $.parseJSON( text );
	}
	catch( e ){
		return false;
	}
	return text;
}

function evaluate( tag, msgError ){
	if( tag.value === undefined || tag.value === null || tag.value.trim() == '' ){ 
		window.setTimeout( function(){ 
			alert( msgError );
			tag.focus(); 
		} , 500 ); 
		return 0; 
	}
	return 1;
}

function evalLength( tag, msgError, min ){
	if( !min ) min = 6;
	if( tag.value.length < min ){ 
		window.setTimeout( function(){ 
			alert( msgError );
			tag.focus(); 
		} , 500 ); 
		return 0; 
	}
	return 1;
}

function evalEmail( tag, msgError ){
	if( !validateEmail( tag.value.trim() ) ){
		window.setTimeout( function(){ 
			alert( msgError );
			tag.focus(); 
		} , 500 ); 
		return 0;
	}
	return 1;
}

function tokenPush(){
	var push = PushNotification.init( { android: {senderID: '587115303220'} } );
	push.on( 'registration', function( data ){ $('#token').val( data.registrationId ) } );
	push.on( 'notification', function( data ){ });
	push.on( 'error', function( e ){} );
}

function validateEmail( m ){ 
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
	return re.test( m ); 
}

function setLS_content( name, val ){
	if( existLS( 'content' ) ){
		var content = getLS( 'content' ),
			arr_content = $.parseJSON( content ),
			num_arr = arr_content.indexOf( name );
		if( num_arr == -1 ){
			setLS( 'content', content.substring( 0, content.length - 1 ) + ', "' + name + '"]' );
		}
		setLS( 'content-' + name, val );
	}else{
		setLS( 'content', '["' + name + '"]' );
		setLS( 'content-' + name, val );
	}
}

function clearLS_content(){
	if( !existLS( 'content' ) ) return 0;
	var content = $.parseJSON( getLS( 'content' ) );
	for( var i = 0, c = content.length; i < c; i++ ){
		delLS( 'content-' + content[i] );
	}
	delLS( 'content' );
}

function getLS_content( name ){
	var res = 0;
	if( existLS( 'content' ) ){
		var content = getLS( 'content' ),
			arr_content = $.parseJSON( content ),
			num_arr = arr_content.indexOf( name );
		if( num_arr == -1 ){
			res = 0;
		}
		res = getLS( 'content-' + name );
	}
	return res;
}

function getAppScript( file, onSuccess ){
	var urlScript = url + file + '?v=' + getLS( 'versionCode' );
	getScript( urlScript, onSuccess );
}

function getScript( urlScript, onSuccess ){
	$.ajax({
		url: urlScript,
		dataType: 'script',
		error: ajax_err,
		success:onSuccess,
		async: true
	}); 
}

function activeSlideEvent(){	
	(function(d){
		var ce=function(e,n){ var a=document.createEvent("CustomEvent");a.initCustomEvent(n,true,true,e.target);
			e.target.dispatchEvent(a);a=null;return false},
		nm=true,sp={x:0,y:0},ep={x:0,y:0}, touch={ touchstart:function(e){sp={x:e.touches[0].pageX,y:e.touches[0].pageY}},
		touchmove:function(e){nm=false;ep={x:e.touches[0].pageX,y:e.touches[0].pageY}},
		touchend:function(e){if(nm){ce(e,'fc')}else{var x=ep.x-sp.x,xr=Math.abs(x),y=ep.y-sp.y,yr=Math.abs(y);
		if(Math.max(xr,yr)>20){ce(e,(xr>yr?(x<0?'swl':'swr'):(y<0?'swu':'swd')))}};nm=true},
		touchcancel:function(e){nm=false} }; for(var a in touch){d.addEventListener(a,touch[a],false);}})
	(document);
}

function inLayout( name ){
	return layout == name;
}

function setLayout( name ){
	layout = name;
}

var addRippleEffect = function (e) {
    var target = e.target;
    if ( !target.classList.contains( 'rips' )) target = target.parentElement;
	if ( target === null || !target.classList.contains( 'rips' ) ) return 0;
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector( '.ripple' );
    if ( !ripple ) {
        ripple = document.createElement( 'span' );
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max( rect.width, rect.height ) + 'px';
        target.appendChild( ripple );
    }
    ripple.classList.remove( 'show' );
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add( 'show' );
    return false;
}

function setRippleEffect(){
	setTimeout( function(){
		document.addEventListener('click', addRippleEffect, false);
	}, 1000);
}

function TblBack_Clicked(){ 
	if( confirm( 'Yakin keluar aplikasi ?' ) ){
		navigator.app.exitApp()
	} 
}

function deviceReady() { 
	document.addEventListener('backbutton', TblBack_Clicked, false); 
}

function setDate(){
	var date = new Date();
	$( '.datepicker' ).datepicker({ 
		dayNames: getDayNames(),
		monthNames: getMonthNames(),
		dateFormat: 'DD, d MM yy',
		onSelect: function() { 
			var dateTime = new Date( $( this ).datepicker( 'getDate' ) ),
				strDateTime =  dateTime.getFullYear() + '-' + ( dateTime.getMonth() + 1 ) + '-' + dateTime.getDate();
			var id = this.id.substr( 1, this.id.length );
			$('#'+id).val (strDateTime );
		}
	}).datepicker( 'setDate', date );	
	var strDateTime =  date.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate();
	$( '.date_val' ).val( strDateTime );
}

function showImgApp( show ){
	var img = $( '#img-apps' );
	if( show ){
		img.removeClass( 'animate-opacity-lost' );
		img.addClass( 'animate-opacity' );
		setTimeout(function() {
			img.show();
		}, 500 );
	}else{
		img.removeClass( 'animate-opacity' );
		img.addClass( 'animate-opacity-lost' );
		setTimeout(function() {
			img.hide();
		}, 500 );
	}
}

function getDateNow(){
	var today = new Date(),
		dd = today.getDate(),
		mm = today.getMonth() + 1,
		yyyy = today.getFullYear();
	if( dd < 10 ) {
		dd = '0' + dd;
	} 
	if( mm < 10) {
		mm = '0' + mm;
	}
	today = yyyy + '-' + mm + '-' + dd;
	return today;
}

function getDateTimeNow() {
    var now     = new Date(),
		year    = now.getFullYear(),
		month   = now.getMonth() + 1, 
		day     = now.getDate(),
		hour    = now.getHours(),
		minute  = now.getMinutes(),
		second  = now.getSeconds(); 
    if( month < 10 ) {
        month = '0' + month;
    }
    if( day < 10 ) {
        day = '0' + day;
    }   
    if( hour < 10 ) {
        hour = '0' + hour;
    }
    if( minute < 10 ) {
        minute = '0' + minute;
    }
    if( second < 10 ) {
        second = '0' + second;
    }
 	// var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;   
	// return dateTime;
	var now = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;   
	return now;
}

/*
chat : 
 - var onFinding.scroll.chat = false;
 - var onFinding.new.chat = true;
 - load last 20 (from get date time now)
 - catchNew
 - setOnScrollChat{
	  onFinding.scroll.chat = true;
	  catchLastChat( 20, lastDate )
	}
report :
 - var onFindig.scroll.report = false;
 - var onFindig.new.report = true;
 - load data today only
 - catchNew
 - setOnScroll
summary :
 - var onFindig.scroll.summary = false;
 - var onFindig.new.summary = true;
 - load data today only
 - catchNew
 - setOnScroll
*/