Vue.component('attribute-input-form', {
    template: '#attribute-input-form-component',
    props: {
        label: String,
        variable: String,
        placeholder: String,
        inputType: {
            type: String,
            default: 'text' // Set the default value to 'text'
        },
        value: String, // Use the 'value' prop to bind the input value
    },
    data: function () {
        return {
            inputId: ''
        };
    },
    computed: {
        inputValue: {
            get() {
                return this.value; // Use the 'value' prop as the input value
            },
            set(newValue) {
                this.$emit('input', newValue); // Emit an 'input' event to update the value
            },
        },
    },
    methods: {
        //updateValue() {
        //    this.$emit('update-variable', this.variable, this.inputValue);
        //},
    },
    mounted: function () { },
    watch: {},
});
