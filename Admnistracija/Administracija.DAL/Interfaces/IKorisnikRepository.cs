using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Administracija.Contracts;
namespace Administracija.DAL.Interfaces {
    public interface IKorisnikRepository {
        LoginDataDto GenerateLoginData(string ime, string prezime);
    }
}
