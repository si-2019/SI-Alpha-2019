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
    
    public partial class Zabiljeska
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Zabiljeska()
        {
            this.TerminZabiljeskas = new HashSet<TerminZabiljeska>();
        }
    
        public int idZabiljeska { get; set; }
        public int idStudent { get; set; }
        public string naziv { get; set; }
        public Nullable<System.DateTime> datum { get; set; }
    
        public virtual Korisnik Korisnik { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TerminZabiljeska> TerminZabiljeskas { get; set; }
    }
}
