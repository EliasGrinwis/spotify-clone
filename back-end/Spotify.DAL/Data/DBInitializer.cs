using Microsoft.EntityFrameworkCore;
using Spotify.DAL.Models;

namespace Spotify.DAL.Data
{
    public class DBInitializer
    {
        public static void ClearAllTables(SpotifyContext context)
        {
            context.Songs.RemoveRange(context.Songs);

            // Reset primary key sequence for each table
            context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Song', RESEED, 1)");

            context.SaveChanges();
        }

        public static void Initialize(SpotifyContext context)
        {
            //context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            ClearAllTables(context);

            context.Songs.AddRange(
                new Song { Name = "Scared To Start", Description = "First song description", Image = "https://firebasestorage.googleapis.com/v0/b/spotify-ab8ac.appspot.com/o/images%2Fscared_to_start.jpg?alt=media&token=75226858-f1e6-452b-a1eb-ef04cf572224", Url = "https://firebasestorage.googleapis.com/v0/b/spotify-ab8ac.appspot.com/o/songs%2FMichael%20Marcagi%20-%20Scared%20To%20Start%20(Official%20Lyric%20Video).mp3?alt=media&token=7420aefe-0fff-43c4-afed-1fdd1af80319", Duration = "2:39", SongWriter = "Michael Marcagi" },
                new Song { Name = "Chemical", Description = "Second song description", Image = "https://firebasestorage.googleapis.com/v0/b/spotify-ab8ac.appspot.com/o/images%2FPost-Malone-Chemical-New-Song.jpg?alt=media&token=60afe6fb-ea64-4b2c-9a15-e2447ec1482f", Url = "https://firebasestorage.googleapis.com/v0/b/spotify-ab8ac.appspot.com/o/songs%2FPost%20Malone%20-%20Chemical%20(Official%20Music%20Video).mp3?alt=media&token=32d6a292-3941-4c43-bd09-9f4c4c948ff7", Duration = "3:25", SongWriter = "Post Malone" },
                new Song { Name = "Something to remember", Description = "Third song description", Image = "https://firebasestorage.googleapis.com/v0/b/spotify-ab8ac.appspot.com/o/images%2Fsomething_to_remember.jpg?alt=media&token=eaa3f568-814d-41da-ba6e-27aae03c6f6e", Url = "https://firebasestorage.googleapis.com/v0/b/spotify-ab8ac.appspot.com/o/songs%2FY2meta.app%20-%20Matt%20Hansen%20-%20something%20to%20remember%20(official%20lyric%20video)%20(128%20kbps).mp3?alt=media&token=8b1fb7c7-cf21-4027-a4af-794af5553f93", Duration = "2:41", SongWriter = "Matt Hansen" }
            );
            
            context.SaveChanges();
        }
    }
}
