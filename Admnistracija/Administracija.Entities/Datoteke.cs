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
    
    public partial class Datoteke
    {
        public int idDatoteke { get; set; }
        public int idMaterijal { get; set; }
        public byte[] datoteka { get; set; }
    
        public virtual Materijal Materijal { get; set; }
    }
}
