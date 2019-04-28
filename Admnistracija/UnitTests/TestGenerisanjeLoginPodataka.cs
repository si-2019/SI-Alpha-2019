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

namespace UnitTests {
    [TestClass]
    public class TestGenerisanjeLoginPodataka {

        private  IKorisnikRepository _studentRepository;

        void Setup() {
            IQueryable<Korisnik> korisnici = (new List<Korisnik> {
                new Korisnik {
                    username = "esehovic",
                    indeks = "12345"
                }
            }).AsQueryable();

            Mock<IRepository<Korisnik>> mockKorisnik = new Mock<IRepository<Korisnik>>();
            mockKorisnik.Setup(x => x.GetAll()).Returns(korisnici);

            _studentRepository = new KorisnikRepository(mockKorisnik.Object);
        }

        [TestMethod]
        public void GetLoginData_BasicCase() {
            Setup();
            KorisnikController controller = new KorisnikController(_studentRepository);

            IHttpActionResult actionResult = controller.GetLoginData("Neki", "Test");
            var contentResult = actionResult as OkNegotiatedContentResult<LoginDataDto>;

            Assert.IsNotNull(contentResult);
            Assert.IsNotNull(contentResult.Content);
            Assert.IsTrue(contentResult.Content.Username.StartsWith("ntest"));
            Assert.IsTrue(contentResult.Content.Username == "ntest1");
            Assert.IsTrue(contentResult.Content.Password.Length > 0);
            Assert.IsTrue(contentResult.Content.Indeks == "12346");
        }

        [TestMethod]
        public void GetLoginData_NonUniqueUsername() {
            Setup();
            KorisnikController controller = new KorisnikController(_studentRepository);
            IHttpActionResult actionResult = controller.GetLoginData("Emir", "Sehovic");
            var contentResult = actionResult as OkNegotiatedContentResult<LoginDataDto>;

            Assert.IsNotNull(contentResult);
            Assert.IsNotNull(contentResult.Content);
            Assert.IsTrue(contentResult.Content.Username == "esehovic2");
            Assert.IsTrue(contentResult.Content.Indeks == "12346");

        }
    }
}
