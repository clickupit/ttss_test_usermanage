using Microsoft.AspNetCore.Mvc;
using dotnetapi_api.Models;
using dotnetapi_api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace dotnetapi_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public UserController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("get/all")]
        public async Task<IActionResult> Get()
        {
            List<User> users = await _dbContext.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("get/hn/{hn}")]
        public async Task<IActionResult> GetByHN(int hn)
        {

            var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.HN == hn);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(User user)
        {
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            user.HN = user.Record_ID;
            await _dbContext.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPut("update/hn/{hn}")]
        public async Task<IActionResult> Update(int hn, User user)
        {
            var existingUsers = await _dbContext.Users
                .Where(user => user.HN == hn)
                .ToListAsync();

            if (existingUsers.Count == 0)
            {
                return NotFound();
            }

            foreach (var existingUser in existingUsers)
            {
                existingUser.Name = user.Name;
                existingUser.Lastname = user.Lastname;
                existingUser.Contact_Tel = user.Contact_Tel;
                existingUser.Contact_Email = user.Contact_Email;
            }

            await _dbContext.SaveChangesAsync();
            return Ok(existingUsers);
        }

        [HttpDelete("delete/hn/{hn}")]
        public async Task<IActionResult> Delete(int hn)
        {
            var existingUsers = await _dbContext.Users
                .Where(user => user.HN == hn)
                .ToListAsync();

            if (existingUsers.Count == 0)
            {
                return NotFound();
            }

            _dbContext.Users.RemoveRange(existingUsers);
            await _dbContext.SaveChangesAsync();
            return Ok(existingUsers);
        }

        [HttpGet("search")]
        public IActionResult Search(string searchTerm = "")
        {
            var searchTerms = searchTerm.Split(' ');

            var allUsers = _dbContext.Users.ToList();

            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return Ok(allUsers);
            }

            List<User> fiterUsers = allUsers
                .Where(user => searchTerms.All(term =>
                    user.HN.ToString().TrimStart('0').IndexOf(term.TrimStart('0'), StringComparison.OrdinalIgnoreCase) >= 0 ||
                    user.Name.IndexOf(term, StringComparison.OrdinalIgnoreCase) >= 0 ||
                    user.Lastname.IndexOf(term, StringComparison.OrdinalIgnoreCase) >= 0 ||
                    user.Contact_Tel.IndexOf(term, StringComparison.OrdinalIgnoreCase) >= 0 ||
                    user.Contact_Email.IndexOf(term, StringComparison.OrdinalIgnoreCase) >= 0))
                .ToList();

            return Ok(fiterUsers);
        }


    }
}