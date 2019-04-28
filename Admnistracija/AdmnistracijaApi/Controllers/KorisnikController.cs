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
        [ActionName("AddNewStudent")]
        public IHttpActionResult AddNewStudent([FromBody]KorisnikDto korisnik) {
            if (korisnik != null) {
                LoginDataDto loginData = _korisnikRepository.GenerateLoginData(korisnik.Ime, korisnik.Prezime);
                korisnik.Username = loginData.Username;
                korisnik.Password = loginData.Password;
                korisnik.Indeks = loginData.Indeks;
                korisnik.IdUloga = 1;

                _korisnikRepository.AddNewStudent(korisnik);
            }
            return Ok("Uspješno je dodan korisnik " + korisnik.Username);
        }
    }
}
