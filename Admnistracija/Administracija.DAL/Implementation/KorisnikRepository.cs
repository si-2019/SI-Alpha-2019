using Administracija.Contracts;
using Administracija.DAL.Interfaces;
using Administracija.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Administracija.DAL.Implementation {
    public class KorisnikRepository : IKorisnikRepository {
        private readonly IRepository<Korisnik> _korisnikRepository;

        public KorisnikRepository(IRepository<Korisnik> studentRepository) {
            _korisnikRepository = studentRepository;
        }
      

        public LoginDataProf GenerateLoginDataForProfessor(string ime, string prezime) {
            var userName = ime + "."+ prezime;
            userName = userName.ToLower();


            var listOfUsers = _korisnikRepository.GetAll();
            if (listOfUsers != null) {
                listOfUsers = listOfUsers.Where(user => user.username.StartsWith(userName));
            }
            var brojDuplikata = listOfUsers.ToList().Count;
            Debug.WriteLine(brojDuplikata);
            
           // int brojDuplikata = 0;
            if (brojDuplikata == 0)
                userName += "1";
            else
                userName += ++brojDuplikata;

            var password = GeneratePassword(3, 3, 3);

            return new LoginDataProf
            {
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

        public void AddNewProfessor(KorisnikDto profesor) {
            _korisnikRepository.Insert(new Korisnik {
                idOdsjek = profesor.IdOdsjek, //slat ce naziv s forme
                idUloga = profesor.IdUloga, //treba stavit uvijek id za rpofesora
                ime = profesor.Ime,
                prezime = profesor.Prezime,
                datumRodjenja = profesor.DatumRodjenja,
                JMBG = profesor.Jmbg,
                email = profesor.Email,
                mjestoRodjenja = profesor.MjestoRodjenja,
                kanton = profesor.Kanton,
                drzavljanstvo = profesor.Drzavljanstvo,
                telefon = profesor.Telefon,
                spol = profesor.Spol,
                imePrezimeMajke = profesor.ImePrezimeMajke,
                imePrezimeOca = profesor.ImePrezimeOca,
                adresa = profesor.ImePrezimeOca,
                username = profesor.Username,
                password = profesor.Password,
                linkedin = profesor.Linkedin,
                website = profesor.Website,
                fotografija = profesor.Fotografija,
                indeks = null,
                ciklus = null,
                semestar = null,
                titula = profesor.Titula
            });
            _korisnikRepository.Save();
        }

        public bool provjeraDaLiPostojiJmbg(string profesor_jmbg) {
            var listOfUsers = _korisnikRepository.GetAll();
            if(listOfUsers != null) {
                listOfUsers = listOfUsers.Where(user => user.JMBG.Equals(profesor_jmbg));
            }
            var broj = listOfUsers.ToList().Count;
            if (broj == 0) return false;
            return true;
        }

        public string validacijaPodataka(KorisnikDto profesor) {
            var regexJMBG = "(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])[0-9]{9}";
            var match = Regex.Match(profesor.Jmbg, regexJMBG, RegexOptions.IgnoreCase);
            if (!match.Success) return "Jmbg nije validan";
            else if (profesor.Ime == null) return "Niste unijeli ime";
            else if (profesor.Prezime == null) return "Niste unijeli prezime";
            else if (!validacijaDatumaRodjenja(profesor.DatumRodjenja)) return "Neispravan datum rodjenja";
            else if (!provjeraDatumaJmbg(profesor.DatumRodjenja, profesor.Jmbg)) return "Jmbg i datum rodjenja se ne poklapaju";
            else if (profesor.Email == null || profesor.MjestoRodjenja == null || profesor.Drzavljanstvo == null || profesor.Telefon == null || profesor.ImePrezimeMajke == null || profesor.ImePrezimeOca == null || profesor.Adresa == null || profesor.Titula == null) return "Popunite sva polja";
            return "Sve ok";
        }

         bool validacijaDatumaRodjenja(DateTime datum) {
            if (datum.Year > DateTime.Now.Year) return false;
            else if (datum.Month > DateTime.Now.Month && datum.Year == DateTime.Now.Year) return false;
            else if (datum.Day > DateTime.Now.Day && datum.Month == DateTime.Now.Month && datum.Year == DateTime.Now.Year) return false;
            return true;
        }

        bool provjeraDatumaJmbg(DateTime datum, string jmbg) {
            var day = jmbg.Substring(0, 2);
            var month = jmbg.Substring(2, 2);
            var year = jmbg.Substring(4, 3);
            if (year.Substring(0, 1) != "0") year = "1" + year;
            else year = "2" + year;
            if (day.Substring(0, 1) == "0") day = day.Substring(1, 1);
            if (month.Substring(0, 1) == "0") month = month.Substring(1, 1);


            if (Convert.ToInt32(day) == datum.Day && Convert.ToInt32(month) == datum.Month && Convert.ToInt32(year) == datum.Year) return true;
            return false;

        }
    }
}
