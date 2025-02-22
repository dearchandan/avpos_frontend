const authRoutes = [
    {
        path : '/',
        component : () =>import('@/pages/login.vue'),
        name : 'login',
        meta : {
            authRequired : false,
        },
    },
    {
        path : '/register',
        component : () =>import('@/pages/register.vue'),
        name : 'Register',
        meta : {
            authRequired : false,
        },
    },
    {
        path : '/forgot_password',
        component : () =>import('@/pages/forgot_password.vue'),
        name : 'Forgot Password',
        meta : {
            authRequired : false,
        },
    },
    {
        path : '/reset_password/:user_slack/:token',
        component : () =>import('@/pages/reset_password.vue'),
        name : 'Reset Password',
        meta : {
            authRequired : false,
        },
    },
];

export default authRoutes;