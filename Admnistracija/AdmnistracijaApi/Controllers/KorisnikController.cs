using Administracija.Contracts;
using Administracija.DAL.Implementation;
using Administracija.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AdmnistracijaApi.Controllers
{
    public class KorisnikController : ApiController
    {
        private readonly IKorisnikRepository _korisnikRepository;

        public KorisnikController(IKorisnikRepository korisnikRepository) {
            _korisnikRepository = korisnikRepository;
        }

        [HttpGet]
        [HttpOptions]
        [ActionName("GetLoginData")]
        public IHttpActionResult GetLoginData(string ime, string prezime) {
            return Ok(_korisnikRepository.GenerateLoginData(ime, prezime));           
        }

        [HttpPost]
        [HttpOptions]
        [ActionName("AddNewAssistent")]
        public IHttpActionResult AddNewAssistent([FromBody]KorisnikDto korisnik) {
            LoginDataDto loginData = _korisnikRepository.GenerateLoginData(korisnik.Ime, korisnik.Prezime);
            korisnik.Username = loginData.Username;
            korisnik.Password = loginData.Password;
            korisnik.IdUloga = 2;

            _korisnikRepository.AddNewAssistent(korisnik);

            return Ok("Asistent uspješno dodan!");
        }
    }
}
