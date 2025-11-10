import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const url = "http://payments:3003/payment-service/v1/payments";

  const payload = JSON.stringify({
    orderId: "ORD-" + Math.floor(Math.random() * 10000),
    amount: Math.floor(Math.random() * 500) + 50
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status 200 or 201": (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}
