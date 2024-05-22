using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Factories;
using SystemAPI.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Azure;
using SchoolSystemAPI.Services;

var builder = WebApplication.CreateBuilder(args);

//Jwt configuration starts here
var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("ProfessorOrAssistantOrAdmin", policy => policy.RequireRole("Professor", "Assistant", "Admin"));
    options.AddPolicy("ProfessorOrAssistantOrStudentOrAdmin", policy => policy.RequireRole("Professor", "Assistant", "Student", "Admin"));
    options.AddPolicy("ProfessorOrAssistant", policy => policy.RequireRole("Professor", "Assistant"));
    options.AddPolicy("StudentOrAdmin", policy => policy.RequireRole("Student", "Admin"));
    options.AddPolicy("AssistantOrAdmin", policy => policy.RequireRole("Asistant", "Admin"));
    options.AddPolicy("ProfessorOrAdmin", policy => policy.RequireRole("Professor", "Admin"));
});

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
builder.Services.AddAzureClients(clientBuilder =>
{
    clientBuilder.AddBlobServiceClient(builder.Configuration["AzureStorage:blob"]!, preferMsi: true);
    clientBuilder.AddQueueServiceClient(builder.Configuration["AzureStorage:queue"]!, preferMsi: true);
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddScoped<IAssistantAbstractFactory, AssistantAbstractFactory>();
builder.Services.AddScoped<IProfessorAbstractFactory, ProfessorAbstractFactory>();
builder.Services.AddScoped<IStudentAbstractFactory, StudentAbstractFactory>();

//Singleton pattern for BlobStorageService
builder.Services.AddSingleton<BlobStorageService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var logger = provider.GetRequiredService<ILogger<BlobStorageService>>();
    return BlobStorageService.GetInstance(configuration, logger);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", buildOptions =>
    {
        buildOptions.AllowAnyHeader()
               .AllowAnyMethod()
               .AllowAnyOrigin()
               .WithExposedHeaders("Authorization");
    });
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EduSphereAPI", Version = "v1" });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

    // Dodavanje definicije SecurityScheme za JWT tokene
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    // Dodavanje globalnih zahteva za sigurnost (Security Requirement) koji koriste JWT tokene
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
