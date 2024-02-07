using AutoMapper;
using Spotify.API.Dto.Song;
using Spotify.API.Dto.User;
using Spotify.API.Dto.UserSong;
using Spotify.DAL.Models;

namespace Spotify.API.Mapper
{
    public class AutoMapper : Profile
    {
        public AutoMapper() 
        {
            CreateMap<Song, SongResponse>();
            CreateMap<SongRequest, Song>();

            CreateMap<UserSong, UserSongResponse>();
            CreateMap<UserSongRequest, UserSong>();

            CreateMap<User, UserResponse>();
            CreateMap<UserRequest, User>();
        } 
    }
}
