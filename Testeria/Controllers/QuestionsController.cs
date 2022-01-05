using Testeria.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Testeria.Common;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Testeria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private QuestionService _service;
        public QuestionsController(QuestionService service)
        {
            _service = service;
        }
        // GET: api/<QuestionsController>
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_service.GetAllQuestions());
        }

        // GET api/<QuestionsController>/5
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            return Ok(_service.GetQuestionById(id));
        }

        // GET api/<QuestionsController>/5
        [HttpGet("bySkill/{id}")]
        public IActionResult GetBySkill(string id)
        {
            return Ok(_service.GetQuestionsBySkill(id));
        }

        [HttpGet("byUserId/{id}")]
        public IActionResult GetByUserId(string id)
        {
            return Ok(_service.GetQuestionsByUserId(id));
        }

        // POST api/<QuestionsController>
        [HttpPost]
        public IActionResult Post([FromBody] Question value)
        {
            return Ok(_service.CreateQuestion(value));
            
        }

        // PUT api/<QuestionsController>/5
        [HttpPut]
        public IActionResult Put([FromBody] Question value)
        {
            return Ok(_service.UpdateQuestion(value));
            
        }

        // DELETE api/<QuestionsController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            _service.DeleteQuestion(id);
            return Ok();
        }
    }
}
