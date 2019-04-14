
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Linq.Expressions;
using Administracija.DAL.Interfaces;

namespace Administracija.DAL.Implementation
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly DbSet<T> _dbSet;
        private readonly DbContext _context;

        public Repository(DbContext context) {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public void Insert(T entity) {
            _dbSet.Add(entity);
        }

        public void Delete(T entity) {
            _dbSet.Remove(entity);
        }

        public IQueryable<T> SearchFor(Expression<Func<T,bool>> predicate) {
            return _dbSet.Where(predicate);
        }

        public IQueryable<T> GetAll() {
            return _dbSet;
        }

        public T GetById(int id) {
            return _dbSet.Find(id);
        }

    }
   
}
