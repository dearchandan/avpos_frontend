const reservationRoutes = [
    {
        path : '/reservations',
        component : () => import('@/pages/restaurant/reservations/reservations.vue'),
        name : 'Reservations',
        meta : {
            key : 'SM_RESERVATIONS',
            authRequired : true,
        },
    }
];

export default reservationRoutes;