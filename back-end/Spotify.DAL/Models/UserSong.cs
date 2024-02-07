using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spotify.DAL.Models
{
    public class UserSong
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public int SongId { get; set; }
    }
}
