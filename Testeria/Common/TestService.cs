using Testeria.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Testeria.Data;
using Testeria.ViewModels;

namespace Testeria.Common
{
    public class TestService
    {
        private readonly IMongoCollection<Question> Questions;
        private readonly IMongoCollection<UserTest> UserTests;
        private readonly IMongoCollection<ApplicationUser> Users;
        private readonly IMongoCollection<SkillSet> Skills;
        [Obsolete]
        public TestService(ITesteriaSettings settings, ITokenManager tokenmanager)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            Questions = database.GetCollection<Question>(settings.Questions);
            UserTests = database.GetCollection<UserTest>(settings.UserTests);
            Skills = database.GetCollection<SkillSet>(settings.Skills);
            Users = database.GetCollection<ApplicationUser>(settings.Users);
        }

        public List<TestVM> GetAllUserTests()
        {
            return (from t in UserTests.AsQueryable()
                    join u in Users.AsQueryable()
                    on t.UserId equals u.Id
                    join s in Skills.AsQueryable()
                    on t.SkillId equals s.Id
                    select new TestVM
                    {
                        Id = t.Id,
                        TestId = t.TestId,
                        User = u,
                        Skill = s,
                        Time = t.Time,
                        State = t.State,
                        Mark = t.Mark
                    }).ToList();
        }

        public List<TestVM> GetUserTestByUserId(string id)
        {
            return (from t in UserTests.AsQueryable()
                    where t.UserId == id
                    join u in Users.AsQueryable()
                    on t.UserId equals u.Id
                    join s in Skills.AsQueryable()
                    on t.SkillId equals s.Id
                    select new TestVM
                    {
                        Id = t.Id,
                        TestId = t.TestId,
                        User = u,
                        Skill = s,
                        Time = t.Time,
                        State = t.State,
                        Mark = t.Mark
                    }).ToList();
            
        }

        public List<TestVM> GeUserTestBySkillId(string id)
        {

            return (from t in UserTests.AsQueryable()
                    where t.SkillId == id
                    join u in Users.AsQueryable()
                    on t.UserId equals u.Id
                    join s in Skills.AsQueryable()
                    on t.SkillId equals s.Id
                    select new TestVM
                    {
                        Id = t.Id,
                        TestId = t.TestId,
                        User = u,
                        Skill = s,
                        Time = t.Time,
                        State = t.State,
                        Mark = t.Mark
                    }).ToList();
        }

        public TestVM CreateUserTest(UserTest usertest)
        {
            UserTests.InsertOne(usertest);
            var skill = Skills.AsQueryable().FirstOrDefault(s => s.Id == usertest.SkillId);
            var user = Users.AsQueryable().FirstOrDefault(s => s.Id == usertest.UserId);

            return new TestVM
            {
                Id = usertest.Id,
                User = user,
                Skill = skill,
                Mark = usertest.Mark,
                Time = usertest.Time,
                State = usertest.State,
                TestId = usertest.TestId
            };
        }

        public TestVM UpdateUserTest(UserTest usertest)
        {
            UserTests.ReplaceOne(q => q.Id == usertest.Id, usertest);
            var skill = Skills.AsQueryable().FirstOrDefault(s => s.Id == usertest.SkillId);
            var user = Users.AsQueryable().FirstOrDefault(s => s.Id == usertest.UserId);
            return new TestVM
            {
                Id = usertest.Id,
                User = user,
                Skill = skill,
                Mark = usertest.Mark,
                Time = usertest.Time,
                State = usertest.State,
                TestId = usertest.TestId
            };
        }

        public void DeleteUserTest(string id)
        {
            UserTests.DeleteOne(q => q.Id == id);
        }

    }
}
