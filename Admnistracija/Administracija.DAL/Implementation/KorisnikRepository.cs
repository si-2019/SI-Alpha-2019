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
        public void AddNewAssistent(KorisnikDto asistent) {
            _korisnikRepository.Insert(new Korisnik {
                idOdsjek = asistent.IdOdsjek,
                idUloga = asistent.IdUloga,
                ime = asistent.Ime,
                prezime = asistent.Prezime,
                datumRodjenja = asistent.DatumRodjenja,
                JMBG = asistent.Jmbg,
                email = asistent.Email,
                mjestoRodjenja = asistent.MjestoRodjenja,
                kanton = asistent.Kanton,
                drzavljanstvo = asistent.Drzavljanstvo,
                telefon = asistent.Telefon,
                spol = asistent.Spol,
                imePrezimeMajke = asistent.ImePrezimeMajke,
                imePrezimeOca = asistent.ImePrezimeOca,
                adresa = asistent.ImePrezimeOca,
                username = asistent.Username,
                password = asistent.Password,
                linkedin = asistent.Linkedin,
                website = asistent.Website,
                fotografija = asistent.Fotografija
            });
            _korisnikRepository.SaveChanges();
        }
    }
}
