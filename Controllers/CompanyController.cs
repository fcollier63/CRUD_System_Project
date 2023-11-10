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
    public class CompanyController : Controller
    {
        private readonly CompanyDbContext db_context; // Replace with your DbContext class

        public CompanyController(CompanyDbContext context)
        {
            db_context = context;
        }





        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Company company)
        {

            try
            {

                var newCompany = new Company()
                {
                    CompanyName = company.CompanyName,
                    PhoneNumber = company.PhoneNumber,
                };




                // Associate the new address with the new company
                // Get items from the database using Entity Framework
                db_context.Company.Add(newCompany);
                var items = await db_context.SaveChangesAsync();
                return Ok(items);



            }
            catch (Exception ex)
            {
                return StatusCode(500, $"at controller Internal server error:{ex.Message}\n{ex.StackTrace}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> Read()
        {
            try
            {
                // Get items from the database using Entity Framework
                var items = await db_context.Company.ToListAsync();

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
                if (entityType == "Company")
                {
                    // Replace this with your actual data retrieval logic
                    var company = await db_context.Company.FindAsync(entityId);
                    if (company == null)
                    {
                        return NotFound();
                    }

                    return Ok(company);
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
        public async Task<IActionResult> UpdateItem([FromBody] Company company)
        {
            //if (!CompanyExists(companyId))
            //{
            //    return BadRequest(); // Return a bad request response if IDs don't match
            //}

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Return validation errors as a bad request
            }

            var existingCompany = await db_context.Company.FindAsync(company.CompanyId);

            if (existingCompany == null)
            {
                return NotFound();
            }

            // Update the properties of the existing company with the values from the updatedCompany
            existingCompany.CompanyName = company.CompanyName;
            existingCompany.PhoneNumber = company.PhoneNumber;

            await db_context.SaveChangesAsync();
            return Ok(existingCompany);

        }


        [HttpPost]
        public async Task<IActionResult> List([FromBody] Company company)
        {
            try
            {
                var result = await db_context.Company
                    .Where(p =>
                        (string.IsNullOrEmpty(company.CompanyName) || p.CompanyName == company.CompanyName) &&
                        (string.IsNullOrEmpty(company.PhoneNumber) || p.PhoneNumber == company.PhoneNumber))
                    .Select(p => new
                    {
                        CompanyId = p.CompanyId,
                        CompanyName = p.CompanyName,
                        PhoneNumber = p.PhoneNumber,
                        AddressCount = p.Addresses.Count() // Count of associated addresses
            })
                    .ToListAsync();

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
        public async Task<IActionResult> DeleteItem(int companyId)
        {
            try
            {
                var existingCompany = await db_context.Company.FindAsync(companyId);

                if (existingCompany == null)
                {
                    return Ok("No id?????"); // Company not found
                }

                db_context.Company.Remove(existingCompany);
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
