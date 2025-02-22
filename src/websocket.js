import Echo from 'laravel-echo';

/* Websocket Configuration */
let echoInstance = null;

if(localStorage.getItem("auth")){

    echoInstance = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        wsHost: import.meta.env.VITE_PUSHER_WS_HOST,
        wsPort: import.meta.env.VITE_PUSHER_WS_PORT,
        wssPort: import.meta.env.VITE_PUSHER_WSS_PORT,
        forceTLS: (import.meta.env.VITE_PUSHER_FORCE_TLS == "true") ? true : false,
        encrypted: (import.meta.env.VITE_PUSHER_ENCRYPTED == "true") ? true : false,
        enabledTransports: ['ws','wss'],
        authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT,
        auth: {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).access_token}`, // Adjust according to your auth method
            },
        },
    });
}

export default echoInstance;