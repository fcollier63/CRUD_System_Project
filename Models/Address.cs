namespace crudSystemProject.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    public class Address
    {
      
        public int AddressId { get; set; }
        public string StreetAddress1 { get; set; }
        public string StreetAddress2 { get; set; }
        public string Region { get; set; }
        public string PostCode { get; set; }


        
        public int CompanyId { get; set; }
        
        public virtual Company Company { get; set; }
        


        public int CountryId { get; set; }
       
        public virtual Country Country { get; set; }




    }
}
