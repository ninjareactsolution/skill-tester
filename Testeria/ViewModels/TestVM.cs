using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Testeria.Models;

namespace Testeria.ViewModels
{
    public class TestVM
    {
        public string Id { get; set; }
        public ApplicationUser User { get; set; }
        public SkillSet Skill { get; set; }
        public string TestId { get; set; }
        public int Time { get; set; }
        public bool State { get; set; }
        public float Mark { get; set; }
    }
}
