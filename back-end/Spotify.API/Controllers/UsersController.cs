using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Spotify.API.Dto.User;
using Spotify.API.Dto.UserSong;
using Spotify.DAL.Data;
using Spotify.DAL.Models;

namespace Spotify.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly SpotifyContext _context;
        private readonly IMapper _mapper;

        public UsersController(SpotifyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserResponse>>> GetUsers()
        {
            var users = await _context.Users.ToArrayAsync();

            if (users == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<UserResponse>>(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return _mapper.Map<UserResponse>(user);
        }

        [HttpPost]
        public async Task<ActionResult<UserResponse>> CreateUser(UserRequest userRequest)
        {
            User newUser = _mapper.Map<User>(userRequest);
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            UserResponse userToReturn = _mapper.Map<UserResponse>(newUser);

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, UserRequest userRequest)
        {
            // Retrieve the user from the database
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Map the incoming userRequest to the existing user entity
            _mapper.Map(userRequest, user);

            // Save the changes to the database
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Map the updated user entity to a response DTO
            var userResponse = _mapper.Map<UserResponse>(user);

            // Return the updated user data
            return Ok(userResponse);
        }
    }
}
