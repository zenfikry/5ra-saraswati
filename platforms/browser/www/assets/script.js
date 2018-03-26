// var url = "http://localhost/_projects-apps/5RA-v2/adminsystem/";
var url = 'http://lptsaraswati.com/adminsystem/';
	urlTarget = url + "apps.php";

function showLoading(){
	var loading = $("#loading");
	loading.addClass('animate-opacity');
	setTimeout(function(){ 
		loading.show(); 
	}, 500);
}

function hideLoading(){
	var loading = $("#loading");
	loading.addClass('animate-opacity-lost');
	setTimeout(function(){ 
		loading.hide(); 
	}, 500);
}

$(document).ready(function(){
	setTimeout(function(){
		var loading = $("#loading"),
			whiteScreen = $("#white-screen");
		whiteScreen.addClass('animate-opacity-lost');
		setTimeout(function(){
			whiteScreen.hide();
			getVersionCode();
		}, 500);
	}, 1000);
});

function getVersionCode(){
	var data = { m : "getVersionCode" },
		onSuccess = function(res){
			localStorage.setItem('versionCode', res);
		};
	getX(data, onSuccess);
}

function tryLogin(ths){
	var i = ths.getElementsByTagName('input');
	if(i[0].value.trim() == ''){ alert('User ID/Email harus diisi !'); i[0].focus(); return false; }
	if(i[1].value.trim() == ''){ alert('Password harus diisi !'); i[1].focus(); return false; }
	
	var data = { m : 'tryLogin', user_id :i[0].value, password : i[1].value },
		onSuccsess = function(res){
			var rs = res.split("<#SEPARATOR#114#>");
			if( rs[0] == 1 ){ var nama = rs[3].split(' '), has = rs[6]; i[0].value = ''; i[1].value = '';
				alert('Selamat datang '+nama[0]+'\nAnda berhasil Login !');
				localStorage.setItem( 'id_member', rs[1] ); localStorage.setItem( 'user_id', rs[2] );
				localStorage.setItem( 'nama_member', rs[3] ); localStorage.setItem( 'email', rs[4] );
				localStorage.setItem( 'status', rs[5] ); setNavEntry(rs[5], has); readHome(); setHome('login');
			}else if( rs[0] === '0' ){ alert('User ID/Email atau password salah !'); i[0].focus(); i[1].value = ''; }
			else{ alert('Terjadi kesalahan sistem, silahkan coba beberapa saat lagi !'); }
		};
	getX(data, onSuccess);
}

function getX(sendData, onSuccess){
	$.ajax({
		url: urlTarget,
		traditional: true,
		type: "post",
		dataType: "text",
		data: sendData,
		error: ajax_err,
		success: onSuccess
	}); 
}

function tryAgain(msg){ 
	alert(msg); 
}

function ajax_err(jqXHR, exception){
	if ( jqXHR.status === 0 ) { 
		tryAgain( 'Tidak ada koneksi\nPastikan jaringan anda aktif' );
	} else if ( jqXHR.status == 404 ) { 
		tryAgain( 'Halaman server tidak ditemukan [404]' ); 
	} else if ( jqXHR.status == 500 ) { 
		tryAgain( 'Internal Server Error [500]' ); 
	} else if ( exception === 'parsererror' ) { 
		tryAgain( 'Gagal pembacaan JSON yang dibutuhkan' ); 
	} else if ( exception === 'timeout' ) { 
		tryAgain( 'Terlalu lama' ); 
	} else if ( exception === 'abort' ) { 
		tryAgain( 'Koneksi ditolak' ); 
	} else { tryAgain( 'Error tidak biasa :\n' + jqXHR.responseText ); }
}