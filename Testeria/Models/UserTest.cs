using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Testeria.Models
{
    public class UserTest 
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string SkillId { get; set; }
        public string TestId { get; set; }
        public int Time { get; set; }
        public bool State { get; set; }
        public float Mark { get; set; }
    }
}
