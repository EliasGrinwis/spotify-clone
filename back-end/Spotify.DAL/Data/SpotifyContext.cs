using Microsoft.EntityFrameworkCore;
using Spotify.DAL.Models;

namespace Spotify.DAL.Data
{
    public class SpotifyContext : DbContext
    {
        public SpotifyContext() { }

        public SpotifyContext(DbContextOptions<SpotifyContext> options) : base(options) {}

        public DbSet<Song> Songs { get; set; }
        public DbSet<UserSong> UserSongs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Song>().ToTable("Song");
        }
    }
}
