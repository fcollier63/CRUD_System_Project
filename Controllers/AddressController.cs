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
    public class AddressController : Controller
    {
        private readonly CompanyDbContext db_context; // Replace with your DbContext class

        public AddressController(CompanyDbContext context)
        {
            db_context = context;
        }





        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Address address)
        {

            try
            {

                var newAddress = new Address()
                {
                    StreetAddress1 = address.StreetAddress1,
                    StreetAddress2 = address.StreetAddress2,
                    Region = address.Region,
                    PostCode = address.PostCode,
                    CountryId = address.CountryId,
                    CompanyId = address.CompanyId

                };
                // Get items from the database using Entity Framework

                //var newAddress = new Address()
                //{
                //    StreetAddress1 = "19",
                //    StreetAddress2 = "Street",
                //    Region = "Eu",
                //    PostCode = "D16",
                //    CountryId = 3,
                //    CompanyId = 1 
                //};


                db_context.Address.Add(newAddress);
                var items = await db_context.SaveChangesAsync();
                return Ok(items);



            }
            catch (Exception ex)

            {
                while (ex.InnerException != null)
                {
                    ex = ex.InnerException;
                }

                // Log the inner exception details
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return StatusCode(500, $"at controller Internal server error:{ex.Message}\n{ex.StackTrace}");
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Address>>> Read()
        {
            try
            {
                // Get items from the database using Entity Framework
                var items = await db_context.Address.ToListAsync();

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
                if (entityType == "Address")
                {
                    // Replace this with your actual data retrieval logic
                    var address = await db_context.Address.FindAsync(entityId);
                    if (address == null)
                    {
                        return NotFound();
                    }

                    return Ok(address);
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
        public async Task<IActionResult> UpdateItem([FromBody] Address address)
        {
            //if (!CompanyExists(companyId))
            //{
            //    return BadRequest(); // Return a bad request response if IDs don't match
            //}

           

            var existingAddress = await db_context.Address.FindAsync(address.AddressId);

            if (existingAddress == null)
            {
                return NotFound();
            }

            // Update the properties of the existing company with the values from the updatedCompany
            existingAddress.StreetAddress1 = address.StreetAddress1;
            existingAddress.StreetAddress2 = address.StreetAddress2;
            existingAddress.Region = address.Region;
            existingAddress.PostCode = address.PostCode;


            existingAddress.CountryId = address.CountryId;
            existingAddress.CompanyId = address.CompanyId;

            await db_context.SaveChangesAsync();
            return Ok(existingAddress);

        }


        [HttpPost]
        public async Task<IActionResult> List([FromBody] Address address)
        {
            try
            {



                var query = await db_context.Address.Include(a => a.Company).Include(a => a.Country).AsNoTracking()
     .Where(x =>
                (string.IsNullOrEmpty(address.StreetAddress1) || x.StreetAddress1 == address.StreetAddress1) &&
                (string.IsNullOrEmpty(address.StreetAddress2) || x.StreetAddress2 == address.StreetAddress2) &&
                (string.IsNullOrEmpty(address.Region) || x.Region == address.Region) &&
                (string.IsNullOrEmpty(address.PostCode) || x.PostCode == address.PostCode) &&
                (x.CountryId == address.CountryId || address.CountryId == 0) &&
                (x.CompanyId == address.CompanyId || address.CompanyId == 0) &&
                (string.IsNullOrEmpty(address.Company.CompanyName) || x.Company.CompanyName == address.Company.CompanyName) &&
                (string.IsNullOrEmpty(address.Country.CountryName) || x.Country.CountryName == address.Country.CountryName))
     .Select(p => new
     {
         StreetAddress1 = p.StreetAddress1,
         StreetAddress2 = p.StreetAddress2,
         Region = p.Region,
         PostCode = p.PostCode,
         CountryId = p.CountryId,
         CountryName = p.Country.CountryName,
         CompanyId = p.CompanyId,
         CompanyName = p.Company.CompanyName
     }).ToListAsync();








                if (query.Count == 0)
                {
                    return Ok("No matching records found.");
                }
                
                {
                    
                }

                return Ok(query);
            }
            catch (Exception e)
            {
                if (e.InnerException != null)
                {
                    // Additional information from the inner exception, if needed
                }
                else
                {
                    Console.WriteLine("No Inner Exception");
                }
                return StatusCode(500, $"Internal server error: {e.Message}");
            }


        }


        [HttpDelete]
        public async Task<IActionResult> DeleteItem(int addressId)
        {
            try
            {
                var existingAddress = await db_context.Address.FindAsync(addressId);

                if (existingAddress == null)
                {
                    return Ok("No id?????"); // Company not found
                }

                db_context.Address.Remove(existingAddress);
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
