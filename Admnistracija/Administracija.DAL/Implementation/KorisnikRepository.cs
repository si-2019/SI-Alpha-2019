using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Administracija.Entities;
using Administracija.Contracts;
using Administracija.DAL.Interfaces;

namespace Administracija.DAL.Implementation {


    public class KorisnikRepository : IKorisnikRepository {
        private readonly IRepository<Korisnik> _korisnikRepository;
        public KorisnikRepository(IRepository<Korisnik> korisnikRepository) {
            _korisnikRepository = korisnikRepository;
        }

        public LoginDataDto GenerateLoginDataForProfessor(string ime, string prezime) {
            var userName = "zl";
            var password = "fff";


            return new LoginDataDto {
                Username = userName,
                Password = password,
                Mail = userName + "@etf.unsa.ba"
            };
        }
    }
}
