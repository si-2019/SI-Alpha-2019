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
            var userName = ime + prezime;
            userName.ToLower();

            var listOfUsers = _korisnikRepository.GetAll();
            if (listOfUsers != null) {
                listOfUsers = listOfUsers.Where(user => user.ime == ime && user.prezime == prezime && user.Uloga.naziv == "Profesor");
            }
            var brojDuplikata = listOfUsers.ToList().Count;
            if (brojDuplikata == 0)
                userName += userName + "1";
            else
                userName += userName + ++brojDuplikata;

            var password = GeneratePassword(3, 3, 3);

            return new LoginDataDto {
                Username = userName,
                Password = password
            };
        }
        public static string GeneratePassword(int lowercase, int uppercase, int numerics) {
            string lowers = "abcdefghijklmnopqrstuvwxyz";
            string uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string number = "0123456789";

            Random random = new Random();

            string generated = "!";
            for (int i = 1; i <= lowercase; i++)
                generated = generated.Insert(
                    random.Next(generated.Length),
                    lowers[random.Next(lowers.Length - 1)].ToString()
                );

            for (int i = 1; i <= uppercase; i++)
                generated = generated.Insert(
                    random.Next(generated.Length),
                    uppers[random.Next(uppers.Length - 1)].ToString()
                );

            for (int i = 1; i <= numerics; i++)
                generated = generated.Insert(
                    random.Next(generated.Length),
                    number[random.Next(number.Length - 1)].ToString()
                );

            return generated.Replace("!", string.Empty);

        }
    }
}
