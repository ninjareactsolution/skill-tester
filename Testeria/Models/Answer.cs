using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Testeria.Models
{
    public class Answer 
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public bool State { get; set; }

    }
}
