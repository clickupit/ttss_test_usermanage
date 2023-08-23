using Microsoft.EntityFrameworkCore;
using dotnetapi_api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var myOrigins = "_myOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myOrigins, policy =>
    {
        policy.WithOrigins("*")//ผมเปิด CORS ไว้ให้เพื่อความสะดวกในการเทส
    .AllowAnyHeader()
    .AllowAnyMethod()
    ;
    });
});

var app = builder.Build();

app.UseCors(myOrigins);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
