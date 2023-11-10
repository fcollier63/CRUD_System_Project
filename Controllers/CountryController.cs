using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.EntityFrameworkCore;
using crudSystemProject.Models;
using Microsoft.AspNetCore.Mvc;
using crudSystemProject.DAL;

namespace crudSystemProject.Controllers
{
    [Route("[controller]/[action]")]
    public class CountryController : Controller
    {
        private readonly CompanyDbContext db_context; // Replace with your DbContext class

        public CountryController(CompanyDbContext context)
        {
            db_context = context;
        }





        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Country country)
        {

            try
            {

                var newCountry = new Country()
                {
                    CountryName = country.CountryName,
                };


               

                // Get items from the database using Entity Framework
                db_context.Country.Add(newCountry);
                var items = await db_context.SaveChangesAsync();
                return Ok(items);



            }
            catch (Exception ex)
            {
                return StatusCode(500, $"at controller Internal server error:{ex.Message}\n{ex.StackTrace}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Country>>> Read()
        {
            try
            {
                // Get items from the database using Entity Framework
                var items = await db_context.Country.ToListAsync();

                if (items == null || items.Count == 0)
                {
                    return NoContent(); // Return 204 No Content if no items are found
                }

                return Ok(items); // Return a 200 OK response with the list of items
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetEntity(string entityType, int entityId)
        {
            try
            {
                // Your logic to fetch the data based on entityType and entityId
                // This could involve querying your database or some other data source

                // For example, if you're working with a Company entity:
                if (entityType == "Country")
                {
                    // Replace this with your actual data retrieval logic
                    var country = await db_context.Country.FindAsync(entityId);
                    if (country == null)
                    {
                        return NotFound();
                    }

                    return Ok(country);
                }
                // Add similar logic for other entity types like Address and Country

                // If the entityType is not recognized, return a 404 Not Found
                return NotFound();
            }
            catch (Exception ex)
            {
                // Handle any exceptions or errors that occur during data retrieval
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPut]
        public async Task<IActionResult> UpdateItem([FromBody] Country country)
        {
            

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); 
            }

            var existingCountry = await db_context.Country.FindAsync(country.CountryId);

            if (existingCountry == null)
            {
                return NotFound();
            }

            existingCountry.CountryName = country.CountryName;

            await db_context.SaveChangesAsync();
            return Ok(existingCountry);

        }

        
        [HttpPost]
        public async Task<IActionResult> List([FromBody] Country country)
        {
            try
            {
                //var result = await db_context.Company
                //                  .Where(p => p.CompanyName == "dogpatch"
                //                           //&& p.PhoneNumber == company.PhoneNumber
                //                           ).ToListAsync();

                var result = await db_context.Country
                                  .Where(p => (string.IsNullOrEmpty(country.CountryName) ||  p.CountryName == country.CountryName
                                           //&& p.PhoneNumber == company.PhoneNumber
                                           )).ToListAsync();
                if (result.Count == 0)
                {
                    return Ok("No matching records found.");
                }

                return Ok(result);
            }
            catch (Exception e)
            {
                return Ok(e.Message);
            }


        }


        [HttpDelete]
        public async Task<IActionResult> DeleteItem(int countryId)
        {
            try
            {
                var existingCountry = await db_context.Country.FindAsync(countryId);

                if (existingCountry == null)
                {
                    return Ok("No id?????"); // Company not found
                }

                db_context.Country.Remove(existingCountry);
                await db_context.SaveChangesAsync(); // Delete the company and save changes

                return Ok("Company deleted successfully");
            }
            catch (Exception ex)
            {
                // Handle any errors, log the exception, and return an error response
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        //private bool CompanyExists(int id)
        //    {
        //        return db_context.Company.Any(e => e.CompanyId == id);
        //    }
    }

}
