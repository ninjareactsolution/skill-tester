using System;
using System.Collections.Generic;
using AspNetCore.Identity.MongoDbCore.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDbGenericRepository.Attributes;

namespace Testeria.Models
{
    [CollectionName("Users")]
    public class ApplicationUser 
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public List<string> Roles { get; set; }
        public string PasswordHash { get; set; }

        public string Gender { get; set; }
        public DateTimeOffset ExpireDate { get; set; }
        public int Age { get; set; }
        public byte[] PasswordSalt { get; set; }
        public AuthToken Token { get; set; }
    }

}
