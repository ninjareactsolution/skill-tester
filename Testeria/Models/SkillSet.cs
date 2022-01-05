using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Testeria.Models
{
    public class SkillSet 
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
