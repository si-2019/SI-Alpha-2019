using Administracija.Contracts;
using Administracija.DAL.Interfaces;
using Administracija.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administracija.DAL.Implementation {
    public class KorisnikRepository : IKorisnikRepository {
        private readonly IRepository<Korisnik> _korisnikRepository;

        public KorisnikRepository(IRepository<Korisnik> korisnikRepository) {
            _korisnikRepository = korisnikRepository;
        }
        public LoginDataDto GenerateLoginData(string ime, string prezime) {

                
            var studenti = _korisnikRepository.GetAll();
            string indeks = "";
            string username = (ime[0] + prezime).ToLower();
            if (studenti != null) {
                indeks = studenti.Select(x => x.indeks).Max();
                studenti = studenti.Where(k => k.username.StartsWith(username));
            }

           
            int brojPostojecih = studenti.ToList().Count;
            username += (1+brojPostojecih).ToString();
            

            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder pwBuilder = new StringBuilder();
            int i = 0;
            Random rnd = new Random();
            while (i ++ < 8) {
                pwBuilder.Append(valid[rnd.Next(valid.Length)]);
            }
            string password = pwBuilder.ToString();
            
            return new LoginDataDto {
                Username = username,
                Indeks = (int.Parse(indeks) + 1).ToString(),
                Password = password                
            };
        }
        public void AddNewStudent(KorisnikDto student) {
            _korisnikRepository.Insert(new Korisnik {
                idOdsjek = student.IdOdsjek,
                idUloga = student.IdUloga,
                ime = student.Ime,
                prezime = student.Prezime,
                datumRodjenja = student.DatumRodjenja,
                JMBG = student.Jmbg,
                email = student.Email,
                mjestoRodjenja = student.MjestoRodjenja,
                kanton = student.Kanton,
                drzavljanstvo = student.Drzavljanstvo,
                telefon = student.Telefon,
                spol = student.Spol,
                imePrezimeMajke = student.ImePrezimeMajke,
                imePrezimeOca = student.ImePrezimeOca,
                adresa = student.Adresa,
                username = student.Username,
                password = student.Password,
                linkedin = student.Linkedin,
                website = student.Website,
                fotografija = student.Fotografija,
                indeks = student.Indeks,
                ciklus = student.Ciklus,
                semestar = student.Semestar
            });
            _korisnikRepository.SaveChanges();
        }
    }
}
