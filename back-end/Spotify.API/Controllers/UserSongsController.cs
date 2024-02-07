using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Spotify.API.Dto.Song;
using Spotify.API.Dto.UserSong;
using Spotify.DAL.Data;
using Spotify.DAL.Models;

namespace Spotify.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSongsController : ControllerBase
    {
        private readonly SpotifyContext _context;
        private readonly IMapper _mapper;

        public UserSongsController(SpotifyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserSongResponse>>> GetUserSongs()
        {
            var userSongs = await _context.UserSongs.ToArrayAsync();

            if (userSongs == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<UserSongResponse>>(userSongs);
        }

        [HttpPost]
        public async Task<ActionResult<UserSongResponse>> CreateUserSong(UserSongRequest userSongRequest)
        {
            UserSong newUserSong = _mapper.Map<UserSong>(userSongRequest);
            _context.UserSongs.Add(newUserSong);
            await _context.SaveChangesAsync();
            UserSongResponse userSongToReturn = _mapper.Map<UserSongResponse>(newUserSong);

            return Ok(userSongToReturn);
        }

        [HttpDelete("{userId}/{songId}")]
        public async Task<ActionResult> DeleteUserSongById(string userId, int songId)
        {
            var userSong = await _context.UserSongs
                .FirstOrDefaultAsync(us => us.UserId == userId && us.SongId == songId);


            if (userSong == null)
            {
                return NotFound();
            }

            _context.UserSongs.Remove(userSong);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
