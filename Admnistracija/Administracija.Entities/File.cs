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
    
    public partial class File
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public File()
        {
            this.TipFiles = new HashSet<TipFile>();
        }
    
        public int idFile { get; set; }
        public int idZadatak { get; set; }
        public byte[] sadrzaj { get; set; }
        public int velicina { get; set; }
        public int idTipFile { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TipFile> TipFiles { get; set; }
        public virtual Zadatak Zadatak { get; set; }
    }
}
