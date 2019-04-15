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
        [ActionName("GetLoginDataForProfessor")]
        public IHttpActionResult GetLoginDataForProfessor(string ime, string prezime) {
            return Ok(_korisnikRepository.GenerateLoginDataForProfessor(ime, prezime));
        }

        //prima json
        [HttpPost]
        [HttpOptions]
        [ActionName("AddProfessor")]
        public IHttpActionResult AddProfessor([FromBody]KorisnikDto profesor) {
            var validacija = _korisnikRepository.validacijaPodataka(profesor);
            if (validacija != "Sve ok") return Ok(validacija);
            if(_korisnikRepository.provjeraDaLiPostojiJmbg(profesor.Jmbg)) {
                 return Ok("Postoji korisnik sa istim jmbg!");                
            }
            LoginDataProf loginData = _korisnikRepository.GenerateLoginDataForProfessor(profesor.Ime, profesor.Prezime);
            profesor.Username = loginData.Username;
            profesor.Password = loginData.Password;
            profesor.IdUloga = 3;

            _korisnikRepository.AddNewProfessor(profesor);

            return Ok("Profesor uspješno registrovan! Username: "+profesor.Username+" Password: " +profesor.Password);
        }

       
    }


}
