using Microsoft.EntityFrameworkCore;
using Spotify.DAL.Data;

var corsConfig = "_corsConfig";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAutoMapper(typeof(Program));

var connectionString = builder.Configuration.GetConnectionString("DevelopmentConnection");

if (builder.Environment.IsProduction())
{
    connectionString = builder.Configuration.GetConnectionString("ProductionConnection");
}

builder.Services.AddDbContext<SpotifyContext>(options =>
options.UseSqlServer(connectionString));


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsConfig,
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://spotify-ab8ac.web.app")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        });
});


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(corsConfig);

using var scope = app.Services.CreateScope();
var myContext = scope.ServiceProvider.GetRequiredService<SpotifyContext>();
DBInitializer.Initialize(myContext);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
