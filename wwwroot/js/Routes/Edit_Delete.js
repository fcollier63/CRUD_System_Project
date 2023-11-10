const editDelete = {
    template: "#EditDelete-template",
    props: ['EntityType', 'Id'],
    data: function () {
        return {
            pageTitle: '',
            pageData: {
                Address: {

                },
                Company: {

                },
                Country: {

                },

            },

            isDeleteModalOpen: false,

            formData: {
                Address: {
                    addressId: '',
                    streetAddress1: '',
                    streetAddress2: '',
                    region: '',
                    postCode: '',
                    countryId: '',
                    companyId: '',
                    //Company: [],
                    //Country: []
                },
                Company: {
                    companyId: '',
                    companyName: '',
                    phoneNumber: '',
                    addresses: []
                },
                Country: {
                    countryId: '',
                    countryName: '',
                },
            }
        };
    },
    created() {

        this.fetchEntityData(this.EntityType, this.Id);



    },
    methods: {

        async fetchEntityData(entityType, entityId) {
            try {
                console.log(`/${entityType}/${entityId}`);

                const response = await axios.get(`/${entityType}/GetEntity/`, {
                    params: {
                        entityType: entityType,
                        entityId: entityId
                    }
                });

                const entityData = response.data;
                const gottenCompanyName = entityData.companyName;

                switch (entityType) {
                    case 'Company':
                        this.pageData.Company = entityData;
                        this.pageTitle = `${entityType} - ${gottenCompanyName}`;
                        break;
                    case 'Address':
                        this.pageData.Address = entityData;
                        this.pageTitle = `${entityType} - ${entityData.postCode}`;
                        break;
                    case 'Country':
                        this.pageData.Country = entityData;
                        this.pageTitle = `${entityType} - ${entityData.countryName}`;
                        break;
                    default:
                        console.error(`Unrecognized entityType: ${entityType}`);
                        break;
                }
            } catch (error) {
                console.error(`Error fetching ${entityType} data:`, error);
            }
        },


        openDeleteModal() {
            this.isDeleteModalOpen = true;

        },
        closeDeleteModal: function () {
            this.isDeleteModalOpen = false;
        },
        //pathReturn: function () {
        //    this.$router.go(-1);
        //},
        pathReturn: function () {
            this.$router.push({
                path: '/Read',
                query: { tab: this.EntityType },
            });
            console.log("last tab", this.EntityType)
        },

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


        async addressConfirmEdit(Id, attributes) {
            try {
                attributes.addressId = Id;

                console.log('Address data:', Id, attributes);

                // attributes.companyId = parseInt(attributes.companyId);
                // attributes.countryId = parseInt(attributes.countryId);
                const response = await axios.put(`/Address/UpdateItem`, attributes);
                console.log('Address updated successfully:', response.data);
                //this.$router.go(-1);
                this.pathReturn();
                this.$root.$emit('company-updated', response.data);
            } catch (error) {
                console.error('Error updating address:', error);
            }
        },

        async companyConfirmEdit(Id, attributes) {
            try {
                attributes.companyId = Id;

                console.log('Company data:', Id, attributes);

                const response = await axios.put(`/Company/UpdateItem`, attributes);
                console.log('Company updated successfully:', response.data);
                //this.$router.go(-1);
                this.pathReturn();
                this.$root.$emit('company-updated', response.data);
            } catch (error) {
                console.error('Error updating company:', error);
            }
        },

        async countryConfirmEdit(Id, attributes) {

            attributes.countryId = Id;

            console.log('CountryID data:', Id);
            console.log('Country data:', attributes);
            axios.put(`/Country/UpdateItem`, attributes).then(response => {
                console.log('Address updated successfully:', response.data);
                //this.closeEditModal()
                //this.$router.go(-1);
                this.pathReturn();
                this.$root.$emit('company-updated', response.data);
            })
                .catch(error => {
                    console.error('Error updating company:', error);
                });

        },




        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        async companyConfirmDelete(companyId) {
            try {
                console.log('companyId:', companyId);

                const response = await axios.delete(`/Company/DeleteItem?companyId=${companyId}`);
                console.log('Company deleted successfully:', response.data);
                //this.closeEditModal()
                //this.$router.go(-1);
                this.closeDeleteModal();
                this.pathReturn();
                this.$root.$emit('company-deleted', response.data);
            } catch (error) {
                console.error('Error deleting company:', error);
            }
        },

        async countryConfirmDelete(countryId) {
            try {
                console.log('countryId:', countryId);

                const response = await axios.delete(`/Country/DeleteItem?countryId=${countryId}`);
                console.log('country deleted successfully:', response.data);
                //this.closeEditModal()
                //this.$router.go(-1);
                this.closeDeleteModal();
                this.pathReturn();
                this.$root.$emit('company-deleted', response.data);
            } catch (error) {
                console.error('Error deleting country:', error);
            }
        },

        async addressConfirmDelete(countryId) {
            console.log('countryId:', countryId);

            try {
                const response = await axios.delete(`/Country/DeleteItem?countryId=${countryId}`);

                console.log('country deleted successfully:', response.data);
                //this.closeEditModal()
                //this.$router.go(-1);
                this.closeDeleteModal();
                this.pathReturn();
                this.$root.$emit('company-deleted', response.data);
            } catch (error) {
                console.error('Error deleting country:', error);
            }
        },


        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        handleDelete(EntityType) {
            switch (EntityType) {
                case 'Address':
                    const addressId = this.$route.params.Id;
                    console.log("handeling Delete")
                    this.addressConfirmDelete(addressId);
                    break;
                case 'Company':
                    const companyId = this.$route.params.Id;
                    this.companyConfirmDelete(companyId);
                    break;
                case 'Country':
                    const countryId = this.$route.params.Id;
                    this.countryConfirmDelete(countryId);
                    break;
                default:
            }
        },
        handleUpdate(EntityType) {
            switch (EntityType) {
                case 'Address':
                    const addressId = this.$route.params.Id;


                    this.addressConfirmEdit(addressId, this.formData.Address);
                    break;
                case 'Company':
                    const companyId = this.$route.params.Id;
                    console.log('Companyid Update:', companyId);

                    console.log('Company Data:', this.formData.Company);

                    this.companyConfirmEdit(companyId, this.formData.Company);
                    break;
                case 'Country':
                    const countryId = this.$route.params.Id;

                    this.countryConfirmEdit(countryId, this.formData.Country);
                    break;
                default:

            }
        },


    },
}