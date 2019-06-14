const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

module.exports = function(){
    autorizacijaAdmin = async function(id) {
		let promise = new Promise((res, rej) => {
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function() {
                if(ajax.readyState == 4 && ajax.status == 200) {
                    console.log(ajax.responseText);
                    if(ajax.responseText == "true") {
                        res(true);
                    } 
                    else res(false);
                }
                else if(ajax.readyState == 4) {
                    res(false);
                }
            }
            ajax.open('GET', 'https://si2019oscar.herokuapp.com/pretragaId/imaUlogu/' + id + '/admin', true);
            ajax.setRequestHeader('Content-Type','application/json');
            ajax.send(); 
        })
        let result = await promise;
        return result;        
    }
}
