//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Administracija.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class predmet_student
    {
        public int id { get; set; }
        public int idStudent { get; set; }
        public int idPredmet { get; set; }
        public Nullable<int> ocjena { get; set; }
        public Nullable<System.DateTime> datum_upisa { get; set; }
    
        public virtual Korisnik Korisnik { get; set; }
        public virtual Predmet Predmet { get; set; }
    }
}
