using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Spotify.API.Dto.Song;
using Spotify.API.Dto.UserSong;
using Spotify.DAL.Data;
using Spotify.DAL.Models;
using System.Security.Claims;

namespace Spotify.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        private readonly SpotifyContext _context;
        private readonly IMapper _mapper;

        public SongsController(SpotifyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<SongResponse>>> GetSongs()
        {
            var songs = await _context.Songs.ToArrayAsync();

            if (songs == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<SongResponse>>(songs);
        }

        [HttpGet("GetSongsByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Song>>> GetSongsByUserId(string userId)
        {
            var userSongs = await _context.UserSongs
                .Where(us => us.UserId == userId)
                .ToListAsync();

            var songIds = userSongs.Select(us => us.SongId).ToList();

            var songs = await _context.Songs
                .Where(song => songIds.Contains(song.Id))
                .ToListAsync();

            return Ok(songs);
        }

        [HttpPost]
        public async Task<ActionResult<SongResponse>> CreateSong(SongRequest songRequest)
        {
            Song newSong = _mapper.Map<Song>(songRequest);
            _context.Songs.Add(newSong);
            await _context.SaveChangesAsync();
            SongResponse songToReturn = _mapper.Map<SongResponse>(newSong);

            return Ok(songToReturn);
        }
    }
}
