
using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Factories;
using SystemAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IAssistantAbstractFactory, AssistantAbstractFactory>();
builder.Services.AddScoped<IProfessorAbstractFactory, ProfessorAbstractFactory>();
builder.Services.AddScoped<IStudentAbstractFactory, StudentAbstractFactory>();


var app = builder.Build();

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
