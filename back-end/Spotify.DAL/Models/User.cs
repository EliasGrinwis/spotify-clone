namespace Spotify.DAL.Models
{
    public class User
    {
        public string? Id { get; set; }
        public string? PhotoURL { get; set; }
        public Boolean? IsAdmin { get; set; } = false;
    }
}
