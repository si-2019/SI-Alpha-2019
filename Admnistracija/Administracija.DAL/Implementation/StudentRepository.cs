using Administracija.Contracts;
using Administracija.DAL.Interfaces;
using Administracija.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administracija.DAL.Implementation {
    public class StudentRepository : IStudentRepository {
        private readonly IRepository<Korisnik> _studentRepository;
        // treba dodati unity resolver

        public StudentRepository(IRepository<Korisnik> studentRepository) {
            _studentRepository = studentRepository;
        }
        public LoginDataDto GenerateLoginData(string ime, string prezime) {

                
            var studenti = _studentRepository.GetAll();

            _studentRepository.GetAll();

            if(studenti != null) {
                studenti = studenti.Where(k => k.ime == ime && k.prezime == prezime
                && (k.Uloga.naziv == "Student" || k.Uloga.naziv == "Asistent"));
            }

            int brojPostojecih = studenti.ToList().Count;
            string username = ime[0] + prezime;
            if(brojPostojecih > 0) {
                username += brojPostojecih.ToString();
            }

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
                Mail = username + "@etf.unsa.ba",
                Password = password                
            };
        }
    }
}
