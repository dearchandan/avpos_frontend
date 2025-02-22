const supportTicketRoutes = [
    {
        path : '/support_tickets',
        component : () => import('@/pages/support_ticket/support_tickets.vue'),
        name : 'Support Tickets',
    },
    {
        path : '/support_ticket/add',
        component : () => import('@/pages/support_ticket/add_support_ticket.vue'),
        name : 'Add Support Tickets',
    },
    {
        path : '/support_ticket/:ticket_id',
        component : () => import('@/pages/support_ticket/view_support_ticket.vue'),
        name : 'View Support Ticket',
    },
];

export default supportTicketRoutes;