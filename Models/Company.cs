namespace crudSystemProject.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    public class Company{
        [Key]
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string PhoneNumber { get; set; }
        public virtual ICollection<Address> Addresses { get; set; }




    }
}
