const Create = {
    template: "#create-template",
    props: ['tab'],
    data: function () {
        return {

            newCompany: {
                companyName: "",
                phoneNumber: ""
            },
            newAddress: {
                streetAddress1: "",
                streetAddress2: "",
                region: "",
                postCode: "",
                countryId: 0,
                companyId: 0
            },
            newCountry: {
                countryName: ""
            },
            currentTab:''
        };
    },
    created() {
        // Access the 'tab' parameter from the route's query and set the initial tab state
        const initialTab = this.$route.query.tab;
        if (initialTab === 'Company' || initialTab === 'Address' || initialTab === 'Country') {
            this.currentTab = initialTab;
            console.log("the current tab is", this.currentTab);
        }

        if (this.currentTab) {

            this.showForm(this.currentTab);
            //this.$router.push({ path: '/Create' });
        }

    },
    methods: {

        showForm(Entity) {
            this.tab = Entity;
        },
       

        pathReturn: function () {
            this.$router.push({
                path: '/Read',
                query: { tab: this.tab },
            });
            console.log("last tab", this.tab)
        },  

        async createCompany() {
            try {
                const response = await axios.post('/Company/Create', this.newCompany);
                this.responseMessage = response.data.message;
                this.$root.$emit('company-updated', response.data);
            } catch (error) {
                console.error('Error at js sending data to the database:', error);
            }
        },

        async createAddress() {
            try {
                const response = await axios.post('/Address/Create', this.newAddress);
                this.responseMessage = response.data.message;
                this.$root.$emit('company-updated', response.data);
            } catch (error) {
                console.error('Error at js sending data to the database:', error);
            }
        },

        async createCountry() {
            console.log('creating dim');
            try {
                const response = await axios.post('/Country/Create', this.newCountry);
                this.responseMessage = response.data.message;
                this.$root.$emit('country-updated', response.data);
            } catch (error) {
                console.error('Error at js sending data to the database:', error);
            }
        }

    }
};