using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administracija.Contracts {
    public class KorisnikDto {
        public int? IdOdsjek;
        public int IdUloga;
        public string Ime;
        public string Prezime;
        public DateTime DatumRodjenja;
        public string Jmbg;
        public string Email;
        public string MjestoRodjenja;
        public string Kanton;
        public string Drzavljanstvo;
        public string Telefon;
        public bool? Spol;
        public string ImePrezimeMajke;
        public string ImePrezimeOca;
        public string Adresa;
        public string Username;
        public string Password;
        public string Linkedin;
        public string Website;
        public byte[] Fotografija;
        public string Indeks;
        public string Ciklus;
        public string Semestar;
        public string Titula;
    }
}
