﻿using Administracija.Contracts;
using Administracija.DAL.Interfaces;
using Administracija.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;

namespace Administracija.DAL.Implementation {
    public class KorisnikRepository : IKorisnikRepository {
        private readonly IRepository<Korisnik> _studentRepository;

        public KorisnikRepository(IRepository<Korisnik> studentRepository) {
            _studentRepository = studentRepository;
        }
      

        public LoginDataProf GenerateLoginDataForProfessor(string ime, string prezime) {
            var userName = ime + "."+ prezime;
            userName = userName.ToLower();


            var listOfUsers = _studentRepository.GetAll();
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
    }
}