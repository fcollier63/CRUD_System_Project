const Read = {
    template: "#read-template",
    data: function () {
        return {
            currentTab: "", // Merge currentTab and currentData into one variable

            companies: [],
            addresses: [],
            countries: [],

            displayedItems: [],
            
            itemCount: 0,
            searchKeyword: '',
            currentPageNumbers: {
                companyPageNumber: cache.currentPageNumbers.companyPageNumber,
                addressPageNumber: cache.currentPageNumbers.addressPageNumber,
                countryPageNumber: cache.currentPageNumbers.countryPageNumber,
            },
        };
    },
    async created() {
        // Call the data fetching functions when the component is created
        await this.readCompany();
        await this.readAddress();
        await this.readCountry();

        this.currentTab = cache.currentTab || 'Company';
        console.log("On create :", this.currentTab, cache.currentPageNumbers.companyPageNumber);


        this.currentPageNumbers.companyPageNumber = cache.currentPageNumbers.companyPageNumber || 1;
        this.currentPageNumbers.addressPageNumber = cache.currentPageNumbers.addressPageNumber || 1;
        this.currentPageNumbers.countryPageNumber = cache.currentPageNumbers.countryPageNumber || 1;

        // Fetch data for the current tab
        this.showData(this.currentTab);

        this.$root.$on('company-updated', this.refreshData);
        this.refreshData();
    },

    methods: {
        setCachePageNumber: function (tab) {
            switch (tab) {
                case 'Company':
                    cache.currentPageNumbers.companyPageNumber = this.currentPageNumbers.companyPageNumber || 1;
                    break;
                case 'Address':
                    cache.currentPageNumbers.addressPageNumber = this.currentPageNumbers.addressPageNumber || 1;
                    break;
                case 'Country':
                    cache.currentPageNumbers.countryPageNumber = this.currentPageNumbers.countryPageNumber || 1;
                    break;
                default:
                    break;
            }
        },

        setPage(pageNumber) {
            // Calculate the start and end indices for the current page
            const start = (pageNumber - 1) * 5; // Assuming 5 items per page
            const end = start + 5;

            // Update the displayedCompanies array with items for the current page
            this.displayedItems = this.filteredData.slice(start, end);
            console.log("setPage displayedItems:", this.displayedItems);

            this.setCachePageNumber(this.currentTab);
        },

        paging: function (pageDirection) {
            if (pageDirection === 'prev' && this.currentPageNumbers[(this.currentTab.toLowerCase()) + 'PageNumber'] > 1) {
                this.currentPageNumbers[(this.currentTab.toLowerCase()) + 'PageNumber']--;
                this.setPage(this.currentPageNumbers[(this.currentTab.toLowerCase()) + 'PageNumber']);
            

            } else if (pageDirection === 'next' && this.currentPageNumbers[(this.currentTab.toLowerCase()) + 'PageNumber'] < this.totalPages) {
                this.currentPageNumbers[(this.currentTab.toLowerCase()) + 'PageNumber']++;
                this.setPage(this.currentPageNumbers[(this.currentTab.toLowerCase()) + 'PageNumber']);
            }
            this.setCachePageNumber(this.currentTab);
            console.log("paging cache:", this.currentTab.toLowerCase(), cache.currentPageNumbers[(this.currentTab.toLowerCase()) + 'PageNumber']);
        },

        // Use the currentTab to determine what data to load
        showData: function (tab) {
            this.currentTab = tab;
            this.refreshData(); // Refresh data when tab is changed
            cache.currentTab = tab;
        },

        refreshData: function () {
            // Use the currentTab to determine what data to load
            if (this.currentTab === 'Company') {
                this.readCompany();
            } else if (this.currentTab === 'Address') {
                this.readAddress();
            } else if (this.currentTab === 'Country') {
                this.readCountry();
            }
            this.setPage(this.currentPageNumbers[(this.currentTab.toLowerCase()) + 'PageNumber']);
        },

        updateDisplayedData() {
            this.currentPageNumbers[(this.currentTab.toLowerCase()) + 'PageNumber'] = 1; // Reset the current page when the keyword changes
            this.setCachePageNumber(this.currentTab);
            this.refreshData();
        },

        getCompanyNameForAddress: function (address) {
            const companyId = address.companyId;
            const company = this.companies.find(company => company.companyId === companyId);
            return company ? company.companyName : 'Company Not Found';
        },
        getCountryForAddress: function (address) {
            const countryId = address.countryId;
            console.log("Country ID should be:", countryId)
            const country = this.countries.find(c => c.countryId === countryId);
            return country ? country.countryName : 'N/A';
        },

        async readCompany() {
            try {
                const response = await axios.get('/Company/Read');
                this.companies = response.data;
            } catch (error) {
                console.error('Error while fetching company data:', error);
            }
        },
        async readAddress() {
            try {
                const response = await axios.get('/Address/Read');
                this.addresses = response.data;
            } catch (error) {
                console.error('Error while fetching address data:', error);
            }
        },
        async readCountry() {
            try {
                const response = await axios.get('/Country/Read');
                this.countries = response.data;
            } catch (error) {
                console.error('Error while fetching country data:', error);
            }
        },

        updateItemCount: function () {
            if (this.currentTab === 'Company') {
                this.itemCount = this.filteredData.length;
            } else if (this.currentTab === 'Address') {
                this.itemCount = this.filteredData.length;
            } else if (this.currentTab === 'Country') {
                this.itemCount = this.filteredData.length;
            }
        },
    },

    computed: {
        totalPages() {
            const rowsPerPage = 5;
            if (this.filteredData === undefined) {
                return 0;
            } else {
                return Math.ceil(this.filteredData.length / rowsPerPage);
            }
        },

        itemCountComputed: function () {
            return this.itemCount;
        },

        filteredData: function () {
            const keyword = this.searchKeyword.toLowerCase();

            if (this.currentTab === 'Company') {
                return this.companies.filter(company => {
                    return company.companyName.toLowerCase().includes(keyword) || company.phoneNumber.includes(keyword);
                });
            } else if (this.currentTab === 'Address') {
                return this.addresses.filter(address => {
                    return (
                        this.getCompanyNameForAddress(address).toLowerCase().includes(keyword) ||
                        address.streetAddress1.toLowerCase().includes(keyword) ||
                        address.streetAddress2.toLowerCase().includes(keyword) ||
                        address.region.toLowerCase().includes(keyword) ||
                        address.postCode.toLowerCase().includes(keyword) ||
                        this.getCountryForAddress(address).toLowerCase().includes(keyword)
                    );
                });
            } else if (this.currentTab === 'Country') {
                return this.countries.filter(country => {
                    return country.countryName.toLowerCase().includes(keyword);
                });
            }
        },
    },

    watch: {
        companies: 'updateItemCount',
        addresses: 'updateItemCount',
        countries: 'updateItemCount',
        searchKeyword: 'updateDisplayedData',
    },
};

const cache = {
    currentPageNumbers: {
        companyPageNumber: 1,
        addressPageNumber: 1,
        countryPageNumber: 1,
    },
    currentTab: "Company",
};


////const Read = {
////    template: "#read-template",
////    data: function () {
////        return {
////            currentTab: '',

////            companies: [],
////            addresses: [],
////            countries: [],

////            displayedCompanies: [],
////            displayedAddresses: [],
////            displayedCountries: [],

////            currentData: null, // Track the current data type (companies, addresses, countries)
////            itemCount: 0,
////            searchKeyword: '',
////            currentPageNumbers: {
////                companyPageNumber: cache.currentPageNumbers.companyPageNumber,
////                addressPageNumber: cache.currentPageNumbers.addressPageNumber,
////                countryPageNumber: cache.currentPageNumbers.countryPageNumber,


////            },
////        };
////    },
////    created() {
////        // Call the data fetching functions when the component is created
////        this.readCompany();
////        this.readAddress();
////        this.readCountry();

////        const currentTab = cache.currentTab || 'Company';

////        this.currentTab = currentTab;
////        this.showData(currentTab);


////        this.currentPageNumbers.companyPageNumber = cache.currentPageNumbers.companyPageNumber || 1;
////        this.currentPageNumbers.addressPageNumber = cache.currentPageNumbers.addressPageNumber || 1;
////        this.currentPageNumbers.countryPageNumber = cache.currentPageNumbers.countryPageNumber || 1;



////        // Fetch data for the current tab
////        this.$root.$on('company-updated', this.refreshData);
////        console.log("create cache :", cache.currentPageNumbers.companyPageNumber)

////        //this.refreshData();
////    },

////    methods: {
////        setCachePageNumber: function (tab) {
////            switch (tab) {
////                case 'Company':
////                    cache.currentPageNumbers.companyPageNumber = this.currentPageNumbers.companyPageNumber || 1;
////                    break;
////                case 'Address':
////                    cache.currentPageNumbers.addressPageNumber = this.currentPageNumbers.addressPageNumber || 1;
////                    break;
////                case 'Country':
////                    cache.currentPageNumbers.countryPageNumber = this.currentPageNumbers.countryPageNumber || 1;
////                    break;
////                default:
////                    break;
////            }


////        },

////        setPage(pageNumber) {
////            // Calculate the start and end indices for the current page
////            const start = (pageNumber - 1) * 5; // Assuming 5 items per page
////            const end = start + 5;

////            // Update the displayedCompanies array with items for the current page
////            this.displayedCompanies = this.filteredData.slice(start, end);
////            this.setCachePageNumber(this.currentTab)
////            console.log("setPage cache :", cache.currentPageNumbers.companyPageNumber)

////        },

////        paging: function (pageDirection) {

////            if (pageDirection === 'prev' && this.currentPageNumbers.companyPageNumber > 1) {
////                this.currentPageNumbers.companyPageNumber--;
////                this.setPage(this.currentPageNumbers.companyPageNumber)
////            } else if (pageDirection === 'next' && this.currentPageNumbers.companyPageNumber < this.totalPages) {
////                this.currentPageNumbers.companyPageNumber++;
////                this.setPage(this.currentPageNumbers.companyPageNumber)

////            }
////            this.setCachePageNumber(this.currentTab)
////            console.log("paging cache :", cache.currentPageNumbers.companyPageNumber)

////            //const start = (this.currentPageNumber - 1) * rowsPerPage;
////            //const end = Math.min(this.currentPageNumber * rowsPerPage, rowCount);

////            //this.displayedCompanies = this.filteredData.slice(start, end);
////        },

////        // Use the currentData to determine what data to load
////        showData: function (dataType) {
////            this.currentTab = dataType,
////            this.currentData = dataType;
////            this.refreshData();
////            cache.currentTab = dataType;

////        },

////        refreshData: function () {
////            // Use the currentData to determine what data to load
////            if (this.currentData === 'Company') {
////                this.readCompany();
////            } else if (this.currentData === 'Address') {
////                this.readAddress();
////            } else if (this.currentData === 'Country') {
////                this.readCountry();
////            }
////            this.setPage(this.currentPageNumbers.companyPageNumber);
////        },

////        updateDisplayedData() {
////            this.currentPageNumbers.companyPageNumber = 1; // Reset the current page when the keyword changes
////            this.setCachePageNumber(this.currentTab)
////            console.log("updateDisplayedData cache :", cache.currentPageNumbers.companyPageNumber)
////            this.refreshData();
////        },


////        getCompanyNameForAddress: function (address) {
////            const companyId = address.companyId;
////            const company = this.companies.find(company => company.companyId === companyId);
////            return company ? company.companyName : 'Company Not Found';
////        },
////        getCountryForAddress: function (address) {
////            const countryId = address.countryId;
////            console.log("Country ID should be:", countryId)
////            const country = this.countries.find(c => c.countryId === countryId);
////            return country ? country.countryName : 'N/A';
////        },



////        async readCompany() {
////            try {
////                const response = await axios.get('/Company/Read');
////                this.companies = response.data;
////            } catch (error) {
////                console.error('Error while fetching company data:', error);
////            }
////        },
////        async readAddress() {
////            try {
////                const response = await axios.get('/Address/Read');
////                this.addresses = response.data;
////            } catch (error) {
////                console.error('Error while fetching address data:', error);
////            }
////        },
////        async readCountry() {
////            try {
////                const response = await axios.get('/Country/Read');
////                this.countries = response.data;
////            } catch (error) {
////                console.error('Error while fetching country data:', error);
////            }
////        },

////        updateItemCount: function () {
////            if (this.currentData === 'Company') {
////                this.itemCount = this.companies.length;
////            } else if (this.currentData === 'Address') {
////                this.itemCount = this.addresses.length;
////            } else if (this.currentData === 'Country') {
////                this.itemCount = this.countries.length;
////            }
////        },
////    },

////    computed: {
////        totalPages() {
////            const rowsPerPage = 5;
////            if (this.filteredData === undefined) {
////                return 0
////            }
////            else { return Math.ceil(this.filteredData.length / rowsPerPage); }

////        },
////        itemCountComputed: function () {
////            return this.itemCount;
////        },

////        filteredData: function () {
////            const keyword = this.searchKeyword.toLowerCase();

////            if (this.currentTab === 'Company') {
////                return this.companies.filter(company => {
////                    return company.companyName.toLowerCase().includes(keyword) ||
////                        company.phoneNumber.includes(keyword)

////                });
////            } else if (this.currentTab === 'Address') {
////                return this.addresses.filter(address => {
////                    return (
////                        this.getCompanyNameForAddress(address).toLowerCase().includes(keyword) ||
////                        address.streetAddress1.toLowerCase().includes(keyword) ||
////                        address.streetAddress2.toLowerCase().includes(keyword) ||
////                        address.region.toLowerCase().includes(keyword) ||
////                        address.postCode.toLowerCase().includes(keyword) ||
////                        this.getCountryForAddress(address).toLowerCase().includes(keyword)
////                    );
////                });
////            } else if (this.currentTab === 'Country') {
////                return this.countries.filter(country => {
////                    return country.countryName.toLowerCase().includes(keyword);
////                });
////            }
////        },

////    },
////    watch: {
////        companies: 'updateItemCount',
////        addresses: 'updateItemCount',
////        countries: 'updateItemCount',

////        searchKeyword: 'updateDisplayedData',

////    },
////};

////const cache = {
////    currentPageNumbers: {
////        companyPageNumber: 1,
////        addressPageNumber: 1,
////        countryPageNumber: 1
////    },
////    currentTab: "Company"
////};

