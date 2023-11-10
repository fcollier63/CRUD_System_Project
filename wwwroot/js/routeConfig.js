const router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        //{ path: '/Company', component: Company },
        //{ path: '/List', component: List },
        {path: '/Create', name: 'create', component: Create,
            props: (route) => ({ tab: route.query.tab }), },
        { path: '/Read', component: Read },
        //{ path: '/UpdateItem', component: Edit }
        //{ path: '/UpdateItem/:companyId', component: Edit },
        { path: '/Update/:EntityType/:Id', component: editDelete, props: true },
        { path: '/List', component: List }

    ]
});
