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

        public StudentRepository(IRepository<Korisnik> studentRepository) {
            _studentRepository = studentRepository;
        }
        public LoginDataDto GenerateLoginData(string ime, string prezime) {

                
            var studenti = _studentRepository.GetAll();
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
    }
}
