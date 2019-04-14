using Administracija.DAL.Implementation;
using Administracija.DAL.Interfaces;
using Administracija.Entities;
using System.Data.Entity;
using System.Web.Http;
using Unity;
using Unity.Lifetime;
using Unity.WebApi;

namespace AdmnistracijaApi
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();

            container.RegisterType<IStudentRepository, StudentRepository>();
            container.RegisterType(typeof(IRepository<>), typeof(Repository<>));
            container.RegisterType<DbContext,TYQcLL35gVEntities>();
            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}