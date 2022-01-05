using Testeria.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Testeria.ViewModels
{
    public class QuestionVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public SkillSet Skill { get; set; }
        public List<Answer> Answers { get; set; }
    }
}
