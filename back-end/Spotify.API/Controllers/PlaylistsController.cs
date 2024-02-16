using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Spotify.API.Dto.Playlist;
using Spotify.API.Dto.Song;
using Spotify.DAL.Data;
using Spotify.DAL.Models;

namespace Spotify.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistsController : ControllerBase
    {
        private readonly SpotifyContext _context;
        private readonly IMapper _mapper;

        public PlaylistsController(SpotifyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<PlaylistResponse>>> GetPlaylists()
        {
            var playlists = await _context.Playlists.ToArrayAsync();

            if (playlists == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<PlaylistResponse>>(playlists);
        }

        [HttpPost]
        public async Task<ActionResult<PlaylistResponse>> CreatePlaylist(PlaylistRequest playlistRequest)
        {
            Playlist newPlaylist = _mapper.Map<Playlist>(playlistRequest);
            _context.Playlists.Add(newPlaylist);
            await _context.SaveChangesAsync();
            PlaylistResponse playlistToReturn = _mapper.Map<PlaylistResponse>(newPlaylist);

            return Ok(playlistToReturn);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePlaylist(int id)
        {
            var playlist = await _context.Playlists
                .FirstOrDefaultAsync(p => p.Id == id);

            if (playlist == null)
            {
                return NotFound();
            }

            _context.Playlists.Remove(playlist);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
