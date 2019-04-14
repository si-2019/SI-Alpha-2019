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
    public class StudentController : ApiController
    {
        private readonly IStudentRepository _studentRepository;

        public StudentController(IStudentRepository studentRepository) {
            _studentRepository = studentRepository;
        }

        [HttpGet]
        [HttpOptions]
        [ActionName("GetLoginData")]
        public IHttpActionResult GetLoginData(string ime, string prezime) {
            return Ok(_studentRepository.GenerateLoginData(ime, prezime));           
        }
    }
}
