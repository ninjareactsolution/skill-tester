using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Testeria.Data
{
    public class TesteriaSettings : ITesteriaSettings
    {
        public string Users { get; set; }
        public string Skills { get; set; }
        public string Questions { get; set; }
        public string TestResults { get; set; }
        public string UserTests { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface ITesteriaSettings
    {
        public string Users { get; set; }
        public string Skills { get; set; }
        public string Questions { get; set; }
        public string TestResults { get; set; }
        public string UserTests { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
