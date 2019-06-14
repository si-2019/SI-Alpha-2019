require('autorizacija.js')();

module.exports = function(){
	autentifikacijaAdmin = function(username, token) {
		$.ajax({
			url: 'https://si2019romeo.herokuapp.com/users/validate',
			type: 'get',
			dataType: 'json',
			data: jQuery.param({
				username: username
				}),
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", token);
			},
			complete: function (response) {
				if(response.status==200) return autorizacijaAdmin(username);
				else return false
			}
		});
	}
};
	