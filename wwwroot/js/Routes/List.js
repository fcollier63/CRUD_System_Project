const List = {
    template: "#list-template",
    data: function () {
        return {
            modalType: null,
            searchResults: [],
            showingCompanies: false,
            showingAddresses: false,
            showingCountries: false,
            companyCriteria: {
                companyName: '',
                phoneNumber: '',
                Address:{}
            },
            addressCriteria: {
                streetAddress1: '',
                streetAddress2: '',
                region: '',
                postCode: '',
                countryId: 0,
                companyId: 0,
                Company: {
                    companyName: '',
                    phoneNumber: '',
                },
                Country: {  
                    countryName: '',
                },
            },
            countryCriteria: {
                countryName: '',
            },
        };
    },
    methods: {
        showCompanyInputs: function () {
            this.showingCompanies = true;
            this.showingAddresses = false;
            this.showingCountries = false;
        },
        showAddressInputs: function () {
            this.showingCompanies = false;
            this.showingAddresses = true;
            this.showingCountries = false;
        },
        showCountryInputs: function () {
            this.showingCompanies = false;
            this.showingAddresses = false;
            this.showingCountries = true;
        },
        async searchCompany() {
            const criteria = this.companyCriteria;
            try {
                // Send a POST request to your API
                console.log('Search criteria:', criteria);

                const response = await axios.post('/Company/List', criteria);
                this.searchResults = response.data;
                console.log('Search successful:', response.data);
            } catch (error) {
                console.error(error);
            }
        },

        async searchAddress() {
            const criteria = this.addressCriteria;
            try {
                console.log('Search criteria:', criteria);

                const response = await axios.post('/Address/List', criteria);
                this.searchResults = response.data;
                console.log('Search successful:', response.data);
            } catch (error) {
                console.error('Error:', error);

                if (error.response && error.response.data) {
                    console.error('API Response Data:', error.response.data);
                }

                if (error.response && error.response.data && error.response.data.InnerException) {
                    console.error('Inner Exception:', error.response.data.InnerException);
                }
            }
        },
        async searchCountry() {
            const criteria = this.countryCriteria;
            try {
                console.log('Search criteria:', criteria);

                const response = await axios.post('/Country/List', criteria);
                this.searchResults = response.data;
                console.log('Search successful:', response.data);
            } catch (error) {
                console.error(error);
            }
        },

        extractColumnNames(searchResults) {
            if (searchResults.length === 0) {
                return []; 
            }
            const columnNames = Object.keys(searchResults[0]);
            return columnNames
        },
        
    },
    
};
