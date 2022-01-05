using Testeria.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Testeria.service;

namespace Testeria.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private TesteriaService _service;
        public SkillsController(TesteriaService service)
        {
            _service = service;
        }

        [HttpPost]
        [Obsolete]
        public IActionResult CreateSkill(SkillSet skill)
        {
            try
            {
                // create user
                var newSkill = _service.CreateSkill(skill);
                return Ok(newSkill);
            }
            catch (Exception ex)
            {
                // return error message if there was an exception
                return Ok(ex.Message);
            }
        }

        [HttpPost("many")]
        [Obsolete]
        public IActionResult CreateSkills(List<SkillSet> skills)
        {
            try
            {
                // create user
                var newSkill = _service.CreateSkills(skills);
                return Ok(newSkill);
            }
            catch (Exception ex)
            {
                // return error message if there was an exception
                return Ok(ex.Message);
            }
        }

        [HttpGet]
        [Obsolete]
        public IActionResult GetSkills()
        {
            try
            {
                // create user
                return Ok(_service.GetAllSkills());
            }
            catch (Exception ex)
            {
                // return error message if there was an exception
                return Ok(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Obsolete]
        public IActionResult DeleteSkill(string id)
        {
            _service.DeleteSkill(id);
            return Ok();
        }
    }
}
