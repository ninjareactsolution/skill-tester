using AspNetCore.Identity.MongoDbCore.Models;
using Testeria.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Testeria.Common;
using Testeria.Data;
using Testeria.ViewModels;

namespace Testeria.service
{
    public class TesteriaService
    {
        private readonly IMongoCollection<ApplicationUser> Users;
        private IMongoCollection<SkillSet> Skills;
        private IMongoCollection<Question> Questions;
        private ITokenManager _tokenManager;
        [Obsolete]
        public TesteriaService(ITesteriaSettings settings, ITokenManager tokenmanager)
        {
            _tokenManager = tokenmanager;
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            Users = database.GetCollection<ApplicationUser>(settings.Users);
            Skills = database.GetCollection<SkillSet>(settings.Skills);
            Questions = database.GetCollection<Question>(settings.Questions);


            if (Users.Count(filter: u => true) == 0)
            {
                {
                    string passwordHash;
                    byte[] passwordSalt;
                    CreatePasswordHash("elder*6430", out passwordHash, out passwordSalt);

                    Users.InsertOne(new ApplicationUser
                    {
                        UserName = "Administrator",
                        Email = "admin@gmail.com",
                        PasswordHash = passwordHash,
                        PasswordSalt = passwordSalt,
                        Roles = new List<String> { "Admin" }
                    }); ;

                }
            }

            if (Skills.Count(filter: s => true) == 0)
            {
                Skills.InsertOne(new SkillSet { Name = "Angular" });
                Skills.InsertOne(new SkillSet { Name = "React" });
                Skills.InsertOne(new SkillSet { Name = "Vue" });
                Skills.InsertOne(new SkillSet { Name = "ASP.NET" });
                Skills.InsertOne(new SkillSet { Name = "Laravel" });
                Skills.InsertOne(new SkillSet { Name = "Django" });
                Skills.InsertOne(new SkillSet { Name = "Blockchain" });
                Skills.InsertOne(new SkillSet { Name = "Smart Contract" });
                Skills.InsertOne(new SkillSet { Name = "Unity 3D" });
                Skills.InsertOne(new SkillSet { Name = "NextJS" });
                Skills.InsertOne(new SkillSet { Name = "Redux" });
            }
        }

        [Obsolete]
        public ReportVM GetReport()
        {
            return new ReportVM()
            {
                TotalQuestions = Questions.Count(q => true),
                TotalSkills = Skills.Count(s => true),
                TotalUsers = Users.Count(u => true)
            };
        }

        [Obsolete]
        public List<SkillVM> GetAllSkills()
        {
            return Skills.Find(s => true).ToList().Select(s => new SkillVM
            {
                Id = s.Id,
                Name = s.Name,
                Count = Questions.Find(q => q.SkillId == s.Id).Count()
            }).ToList();
        }


        public SkillVM CreateSkill(SkillSet skill)
        {
            Skills.InsertOne(skill);
            return new SkillVM
            {
                Id = skill.Id,
                Name = skill.Name,
                Count = 0
            };
        }

        public List<SkillVM> CreateSkills(List<SkillSet> skills)
        {
            Skills.InsertMany(skills);
            return skills.Select(s => new SkillVM {
                Id = s.Id,
                Name = s.Name,
                Count = 0
            }).ToList();
        }
        public List<ApplicationUser> GetUsers() =>
            Users.Find(User => true).ToList();

        public ApplicationUser GetUserById(string id) =>
            Users.Find<ApplicationUser>(User => User.Id.ToString() == id).FirstOrDefault();

        [Obsolete]
        public ApplicationUser RegisterUser(RegisterModel User)
        {
            if (string.IsNullOrWhiteSpace(User.Password))
                throw new Exception("Password is required");

            if (Users.Find(x => x.Email == User.Email).Count() > 0)
                throw new Exception("EMAIL_EXISTS");

            string passwordHash;
            byte[] passwordSalt;
            CreatePasswordHash(User.Password, out passwordHash, out passwordSalt);

            ApplicationUser newUser = new ApplicationUser();
            newUser.PasswordHash = passwordHash;
            newUser.PasswordSalt = passwordSalt;
            newUser.Email = User.Email;
            newUser.UserName = User.UserName;
            newUser.Token = _tokenManager.Generate(newUser);
            newUser.Roles = new List<String> { "User" };

            newUser.ExpireDate = new DateTimeOffset().AddMinutes(10);
            Users.InsertOne(newUser);
            return newUser;

        }
        public ApplicationUser Authenticate(string Email, string Password)
        {
            if (string.IsNullOrEmpty(Email) || string.IsNullOrEmpty(Password))
                return null;

            ApplicationUser User = Users.Find(x => x.Email == Email).FirstOrDefault();

            // check if UserName exists
            if (User == null)
                throw new Exception("EMAIL_NOT_EXISTS");
            // check if Password is correct

            if (!VerifyPasswordHash(Password, User.PasswordHash, User.PasswordSalt))
                throw new Exception("INVALID_PASSWORD");

            // authentication successful
            User.Token = _tokenManager.Generate(User);
            User.ExpireDate = new DateTimeOffset().AddMinutes(10);

            var update = Builders<ApplicationUser>.Update.Set(u => u.Token, User.Token);
            var filter = Builders<ApplicationUser>.Filter.Eq(u => u.Id, User.Id);
            var options = new UpdateOptions { IsUpsert = true };

            Users.UpdateOne(filter, update, options);

            return User;
        }

        public void UpdateUser(string id, ApplicationUser UserIn) =>
            Users.ReplaceOne(User => User.Id.ToString() == id, UserIn);

        public void RemoveUser(ApplicationUser UserIn) =>
            Users.DeleteOne(User => User.Id == UserIn.Id);

        public void RemoveUser(string id) =>
            Users.DeleteOne(User => User.Id.ToString() == id);

       
        public void DeleteSkill(string id) {
            Skills.DeleteOne(s => s.Id == id);
        }
        private static void CreatePasswordHash(string password, out string passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                byte[] bytes = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }

                passwordHash = builder.ToString();
            }
        }

        private static bool VerifyPasswordHash(string password, string storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 128) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                byte[] computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < computedHash.Length; i++)
                {
                    builder.Append(computedHash[i].ToString("x2"));
                }

                if (builder.ToString() != storedHash) return false;
            }

            return true;
        }
    }
}
