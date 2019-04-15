using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Administracija;
using AdmnistracijaApi.Controllers;
using Administracija.DAL.Interfaces;
using Administracija.DAL.Implementation;
using Administracija.Entities;
using Administracija.Contracts;
using System.Web.Http;
using System.Web.Http.Results;
using Moq;
using System.Linq;
using System.Collections.Generic;
using System.Diagnostics;

namespace UnitTests {
    [TestClass]
    public class TestGenerisanjeLoginPodataka {

        private  IKorisnikRepository _studentRepository;

        void Setup() {
            IQueryable<Korisnik> korisnici = (new List<Korisnik> {
                new Korisnik {
                    username = "neki.t"
                }
            }).AsQueryable();

            Mock<IRepository<Korisnik>> mockKorisnik = new Mock<IRepository<Korisnik>>();
            mockKorisnik.Setup(x => x.GetAll()).Returns(korisnici);

            _studentRepository = new KorisnikRepository(mockKorisnik.Object);
        }

        [TestMethod]
        public void GetLoginData_JedanKorisnik() {
            Setup();
            KorisnikController controller = new KorisnikController(_studentRepository);

            IHttpActionResult actionResult = controller.GetLoginDataForProfessor("Neki", "Test");
            var contentResult = actionResult as OkNegotiatedContentResult<LoginDataProf>;

            Assert.IsNotNull(contentResult);
            Assert.IsNotNull(contentResult.Content);
            Assert.IsTrue(contentResult.Content.Username.StartsWith("neki.test1"));
            Debug.WriteLine(contentResult.Content.Username);
            Assert.IsTrue(contentResult.Content.Username == "neki.test1");
            Assert.IsTrue(contentResult.Content.Password.Length > 0);
        }

        [TestMethod]
        public void GetLoginData_NijeJedinstvenUsername() {
            Setup();
            KorisnikController controller = new KorisnikController(_studentRepository);
            IHttpActionResult actionResult = controller.GetLoginDataForProfessor("Emerald", "Nekovic");
            var contentResult = actionResult as OkNegotiatedContentResult<LoginDataProf>;

            Assert.IsNotNull(contentResult);
            Assert.IsNotNull(contentResult.Content);
            Assert.IsTrue(contentResult.Content.Username == "emerald.nekovic1");

        }
/*
        [TestMethod]
        public void GetLoginData_ProvjeriDodavanje() {
            Setup();
            KorisnikController controller = new KorisnikController(_studentRepository);

            KorisnikDto k = new KorisnikDto { IdOdsjek = 2, IdUloga = 2, Ime = "Zumra", Prezime = "Mahov", DatumRodjenja = new DateTime(1998, 4, 27), Jmbg = "2704998175073", Email = "zum @hot.ba", MjestoRodjenja = "Gorazde", Kanton = "gfdg", Drzavljanstvo = "f", Telefon = "f", Spol = true, ImePrezimeMajke = "3re", ImePrezimeOca = "ffe", Titula = "prof" };
            IHttpActionResult actionResult = controller.AddProfessor(k);
            

            var contentResult = actionResult as JsonResult<string>;
            Assert.IsNotNull(contentResult);
            Assert.IsNotNull(contentResult.Content);
            Assert.IsTrue(contentResult.Content.StartsWith("Ok"));

        }*/
    }
}
