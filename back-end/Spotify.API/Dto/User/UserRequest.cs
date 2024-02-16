namespace Spotify.API.Dto.User
{
    public class UserRequest
    {
        public string? Id { get; set; }
        public string? PhotoURL { get; set; }
        public Boolean IsAdmin { get; set; }

    }
}
