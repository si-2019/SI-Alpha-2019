require('./autorizacija.js')();

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
/*
module.exports = function(){
	autentifikacijaAdmin = function(username, token) {
		let promise = new Promise((res, rej) => {
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function() {
                if(ajax.readyState == 4 && ajax.status == 200) {
                    console.log(ajax.status);
                    if(ajax.status == 200) {
                        return autorizacijaAdmin(username);
                    } 
                    else res(false);
                }
                else if(ajax.readyState == 4) {
                    res(false);
                }
            }
            ajax.open('GET', 'https://si2019romeo.herokuapp.com/users/validate?username=' + username, true);
            ajax.setRequestHeader("Authorization", token);
            ajax.send(); 
        })
        let result = await promise;
        return result;        
	}
};
*/