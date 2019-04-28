﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class TYQcLL35gVEntities : DbContext
    {
        public TYQcLL35gVEntities()
            : base("name=TYQcLL35gVEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Anketa> Anketas { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<ClanGrupe> ClanGrupes { get; set; }
        public virtual DbSet<ClanoviGrupe> ClanoviGrupes { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<Datoteke> Datotekes { get; set; }
        public virtual DbSet<GrupaChat> GrupaChats { get; set; }
        public virtual DbSet<GrupaProjekta> GrupaProjektas { get; set; }
        public virtual DbSet<grupaTermin_student> grupaTermin_student { get; set; }
        public virtual DbSet<GrupaTermina> GrupaTerminas { get; set; }
        public virtual DbSet<GrupaZabiljeska> GrupaZabiljeskas { get; set; }
        public virtual DbSet<Ispit> Ispits { get; set; }
        public virtual DbSet<IspitZabiljeska> IspitZabiljeskas { get; set; }
        public virtual DbSet<Issue> Issues { get; set; }
        public virtual DbSet<IzmjenaPodatakaStudenta> IzmjenaPodatakaStudentas { get; set; }
        public virtual DbSet<Kabinet> Kabinets { get; set; }
        public virtual DbSet<Korisnik> Korisniks { get; set; }
        public virtual DbSet<Materijal> Materijals { get; set; }
        public virtual DbSet<MimeTip> MimeTips { get; set; }
        public virtual DbSet<Odgovor> Odgovors { get; set; }
        public virtual DbSet<Odsjek> Odsjeks { get; set; }
        public virtual DbSet<Pitanje> Pitanjes { get; set; }
        public virtual DbSet<PonudjeniOdgovor> PonudjeniOdgovors { get; set; }
        public virtual DbSet<PopunjenaAnketa> PopunjenaAnketas { get; set; }
        public virtual DbSet<Poruka> Porukas { get; set; }
        public virtual DbSet<Pozicija> Pozicijas { get; set; }
        public virtual DbSet<Predmet> Predmets { get; set; }
        public virtual DbSet<predmet_student> predmet_student { get; set; }
        public virtual DbSet<Privilegija> Privilegijas { get; set; }
        public virtual DbSet<Projekat> Projekats { get; set; }
        public virtual DbSet<ProjektniFile> ProjektniFiles { get; set; }
        public virtual DbSet<ProjektniZadatak> ProjektniZadataks { get; set; }
        public virtual DbSet<Raspored> Rasporeds { get; set; }
        public virtual DbSet<Reply> Replies { get; set; }
        public virtual DbSet<Sticky> Stickies { get; set; }
        public virtual DbSet<SvrhaPotvrde> SvrhaPotvrdes { get; set; }
        public virtual DbSet<Theme> Themes { get; set; }
        public virtual DbSet<TipoviMaterijala> TipoviMaterijalas { get; set; }
        public virtual DbSet<Uloga> Ulogas { get; set; }
        public virtual DbSet<Zabiljeska> Zabiljeskas { get; set; }
        public virtual DbSet<Zadaca> Zadacas { get; set; }
        public virtual DbSet<Zadatak> Zadataks { get; set; }
        public virtual DbSet<ZahtjevZaPotvrdu> ZahtjevZaPotvrdus { get; set; }
        public virtual DbSet<ZeljeniTermin> ZeljeniTermins { get; set; }
        public virtual DbSet<ispiti_rezultati> ispiti_rezultati { get; set; }
        public virtual DbSet<odsjek_predmet> odsjek_predmet { get; set; }
        public virtual DbSet<uloga_privilegija> uloga_privilegija { get; set; }
    }
}
