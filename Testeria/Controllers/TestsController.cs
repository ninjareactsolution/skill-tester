using Testeria.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Testeria.Common;
using Testeria.ViewModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Testeria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestsController : ControllerBase
    {
        private TestService _service;
        private QuestionService _questionService;
        public TestsController(TestService service, QuestionService _qService)
        {
            _service = service;
            _questionService = _qService;
        }
        // GET: api/<TestsController>
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_service.GetAllUserTests());
        }

        // GET api/<TestsController>/5
        [HttpGet("byUserId/{id}")]
        public IActionResult Get(string id)
        {
            return Ok(_service.GetUserTestByUserId(id));
        }

        // POST api/<TestsController>
        [HttpPost]
        public IActionResult Post([FromBody] UserTest value)
        {
            return Ok(_service.CreateUserTest(value));
        }

        [HttpPost("result/{id}")]
        public IActionResult SaveTestResult(string id, [FromBody] List<QuestionVM> results)
        {
            float marks = 0;
            var source = _questionService.GetQuestionsByUserId(id);
            source.ForEach(s =>
            {
                var selResult = results.FirstOrDefault(r => r.Id == s.Id);
                if(selResult != null)
                {
                    var diffAnswers = s.Answers.Except(selResult.Answers);
                    if(diffAnswers.Count() == 0)
                    {
                        marks += 1;
                    }
                }
            });

            return Ok(marks / source.Count() * 5);
        }

        // PUT api/<TestsController>/5
        [HttpPut]
        public IActionResult Put([FromBody] UserTest value)
        {
            return Ok(_service.UpdateUserTest(value));
        }

        // DELETE api/<TestsController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            _service.DeleteUserTest(id);
            return Ok();
        }
    }
}
