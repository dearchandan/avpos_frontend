const inquiryRoutes = [
    {
        path : '/inquiries',
        component : () => import('@/pages/support_ticket/inquiries.vue'),
        name : 'Inquiries',
    }
];

export default inquiryRoutes;