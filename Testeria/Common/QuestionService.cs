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
    public class QuestionService
    {
        private readonly IMongoCollection<Question> Questions;
        private readonly IMongoCollection<ApplicationUser> Users;
        private readonly IMongoCollection<SkillSet> Skills;
        private readonly IMongoCollection<UserTest> UserTests;
        [Obsolete]
        public QuestionService(ITesteriaSettings settings, ITokenManager tokenmanager)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            Questions = database.GetCollection<Question>(settings.Questions);
            Users = database.GetCollection<ApplicationUser>(settings.Users);
            Skills = database.GetCollection<SkillSet>(settings.Skills);
            UserTests = database.GetCollection<UserTest>(settings.UserTests);
        }

        public List<QuestionVM> GetAllQuestions()
        {
            return (from q in Questions.AsQueryable()
                    join s in Skills.AsQueryable()
                    on q.SkillId equals s.Id
                    select new QuestionVM
                    {
                        Id = q.Id,
                        Name = q.Name,
                        Skill = s,
                        Answers = q.Answers
                    }).ToList();
        }

        public QuestionVM GetQuestionById(string id)
        {
            return (from q in Questions.AsQueryable()
                    where q.Id == id
                    join s in Skills.AsQueryable()
                    on q.SkillId equals s.Id
                    select new QuestionVM
                    {
                        Id = q.Id,
                        Name = q.Name,
                        Skill = s,
                        Answers = q.Answers
                    }).FirstOrDefault();
        }

        public QuestionVM CreateQuestion(Question question)
        {
            Questions.InsertOne(question);
            var skill = Skills.AsQueryable().FirstOrDefault(s => s.Id == question.SkillId);
            return new QuestionVM
            {
                Id = question.Id,
                Name = question.Name,
                Skill = skill,
                Answers = question.Answers
            };
        }

        public List<QuestionVM> GetQuestionsBySkill(string skillId)
        {
            return (from q in Questions.AsQueryable()
                    where q.SkillId == skillId
                    join s in Skills.AsQueryable()
                    on q.SkillId equals s.Id
                    select new QuestionVM
                    {
                        Id = q.Id,
                        Name = q.Name,
                        Skill = s,
                        Answers = q.Answers
                    }).ToList();
        }

        public List<QuestionVM> GetQuestionsByUserId(string userId)
        {
            var userTest = UserTests.AsQueryable().FirstOrDefault(u => u.UserId == userId && u.State == false);
            return (from q in Questions.AsQueryable()
                    where q.SkillId == userTest.SkillId
                    join s in Skills.AsQueryable()
                    on q.SkillId equals s.Id
                    select new QuestionVM
                    {
                        Id = q.Id,
                        Name = q.Name,
                        Skill = s,
                        Answers = q.Answers
                    }).ToList();
        }

        public Question UpdateQuestion(Question question)
        {
            Questions.ReplaceOne(q => q.Id == question.Id, question);
            return question;
        }

        public void DeleteQuestion(string id)
        {
            Questions.DeleteOne(q => q.Id == id);
        }
    }
}
