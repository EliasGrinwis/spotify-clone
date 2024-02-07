namespace Spotify.API.Dto.Song
{
    public class SongResponse
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public string? Url { get; set; }
        public string? Duration { get; set; }
        public string? SongWriter { get; set; }

    }
}
