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
    }
}
