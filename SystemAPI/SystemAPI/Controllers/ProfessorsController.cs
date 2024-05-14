﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using SchoolSystemAPI.Factories;
using SystemAPI.Data;

namespace SchoolSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfessorsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IProfessorAbstractFactory _professorFactory;

        public ProfessorsController(DataContext context, IProfessorAbstractFactory professorFactory)
        {
            _context = context;
            _professorFactory = professorFactory;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllProfessors()
        {
            var professors = await _context.Professors.ToListAsync();
            if (professors == null) return NotFound("Professors not found!");

            var result = new List<object>();

            foreach (var prof in professors)
            {
                var user = await _context.Users.FindAsync(prof.UserId);
                if (user != null)
                {
                    var professorObj = _professorFactory.CreateProfessor(user, prof);
                    result.Add(professorObj);
                }
            }
            if (result.Count == 0) return NotFound("Professors not found!");
            else return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProfessor(int id)
        {
            var professor = await _context.Professors.FirstOrDefaultAsync(p => p.Id == id);
            if (professor == null) return NotFound("Professor with the given id Not Found!");

            var user = await _context.Users.FindAsync(professor.UserId);
            if (user == null) return NotFound("Professor with the given id Not Found!");

            var obj = _professorFactory.CreateProfessor(user, professor);
            return Ok(obj);
        }


    }
}