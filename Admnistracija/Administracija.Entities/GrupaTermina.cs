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
    
    public partial class GrupaTermina
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public GrupaTermina()
        {
            this.grupaTermin_student = new HashSet<grupaTermin_student>();
            this.Rasporeds = new HashSet<Raspored>();
            this.Rasporeds1 = new HashSet<Raspored>();
        }
    
        public int idGrupaTermina { get; set; }
        public int idPredmet { get; set; }
        public int idPredavac { get; set; }
        public int idKabinet { get; set; }
        public string naziv { get; set; }
        public Nullable<int> danUSedmici { get; set; }
        public string vrijeme { get; set; }
        public Nullable<int> trajanje { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<grupaTermin_student> grupaTermin_student { get; set; }
        public virtual Predmet Predmet { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Raspored> Rasporeds { get; set; }
        public virtual Korisnik Korisnik { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Raspored> Rasporeds1 { get; set; }
        public virtual Kabinet Kabinet { get; set; }
        public virtual Korisnik Korisnik1 { get; set; }
        public virtual Predmet Predmet1 { get; set; }
    }
}
