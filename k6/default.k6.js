import http from "k6/http";
import { check } from "k6";

import URLS from './urls.js'

export const options = {
    stages: [
        // Ramp-up from 1 to 30 VUs in 30s
        { duration: "2s", target: 30 },

        // Stay on 30 VUs for 60s
        { duration: "5s", target: 30 },

        // Ramp-down from 30 to 0 VUs in 10s
        { duration: "2s", target: 0 }
    ]
};

export default function() {
    const res = http.get(URLS.checkoutUrl);

    check(res, { "status is 200": (r) => r.status === 200 });
}
