using Testeria.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Testeria.service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Testeria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly TesteriaService _TesteriaService;

        public AccountController(TesteriaService service)
        {
            _TesteriaService = service;
        }

        // GET: api/<AccountController>
        [HttpGet]
        public IEnumerable<ApplicationUser> GetUsers()
        {
            return _TesteriaService.GetUsers();
        }

        // GET api/<AccountController>/5
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            try
            {
                return Ok(_TesteriaService.GetUserById(id));
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        // POST api/account/register
        [AllowAnonymous]
        [HttpPost]
        [Route("Register")]
        [Obsolete]
        public IActionResult Register(RegisterModel user)
        {
            try{
                // create user
                var newUser = _TesteriaService.RegisterUser(user);
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                // return error message if there was an exception
                return Ok(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        public IActionResult Authenticate(AuthenticateModel user)
        {
            try
            {
                return Ok(_TesteriaService.Authenticate(user.Email, user.Password));
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        //// PUT api/<AccountController>/5
        //[HttpPut("{id}")]
        //public void Put(ObjectId id, ApplicationUser user)
        //{
        //    _TesteriaService.UpdateUser(id, user);
        //}

        // DELETE api/<AccountController>/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _TesteriaService.RemoveUser(id);
        }
    }
}
