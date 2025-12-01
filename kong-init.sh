#!/bin/sh
set -e

KONG_ADMIN="http://kong:8001"

echo "=== Kong init script start ==="

post() {
  url="$1"
  shift
  /usr/bin/curl -s -X POST "$url" "$@"
}

create_service_and_route() {
  svc_name="$1"
  svc_url="$2"
  route_name="$3"
  route_path="$4"

  echo "Creating service $svc_name -> $svc_url"
  svc_resp=$(post "$KONG_ADMIN/services" --data "name=$svc_name" --data "url=$svc_url")

  echo "Creating route $route_name (path: $route_path)"
  route_resp=$(post "$KONG_ADMIN/services/$svc_name/routes" \
    --data "name=$route_name" \
    --data "paths[]=$route_path")

  route_id=$(echo "$route_resp" | jq -r '.id')
  echo "$route_name id: $route_id"

  echo "$route_id"
}

# check jq
if ! command -v jq >/dev/null 2>&1; then
  echo "jq missing"
  exit 1
fi

# create services + routes
users_route_id=$(create_service_and_route "users_service" "http://users:3004/user-service" "users_route" "/user-service")
products_route_id=$(create_service_and_route "products_service" "http://products:3001/product-service" "products_route" "/product-service")
orders_route_id=$(create_service_and_route "orders_service" "http://orders:3002/order-service" "orders_route" "/order-service")
payments_route_id=$(create_service_and_route "payments_service" "http://payments:3003/payment-service" "payments_route" "/payment-service")

echo "=== Services and routes created ==="

# Apply security plugins at service level
for svc in users_service products_service orders_service payments_service; do
  echo "Applying rate limit to $svc"
  post "$KONG_ADMIN/services/$svc/plugins" \
    --data "name=rate-limiting" \
    --data "config.minute=10" \
    --data "config.policy=local" >/dev/null || true

  echo "Applying request-size-limiting to $svc"
  post "$KONG_ADMIN/services/$svc/plugins" \
    --data "name=request-size-limiting" \
    --data "config.allowed_payload_size=204800" >/dev/null || true
done

echo "Security plugins applied."

# ====================
# CACHE PER ROUTE
# ====================

echo "Applying proxy-cache on ROUTES ==="

# users/:id → 1 dia (86400s)
post "$KONG_ADMIN/routes/$users_route_id/plugins" \
  --data "name=proxy-cache" \
  --data "config.strategy=memory" \
  --data "config.cache_ttl=86400" >/dev/null || true

# products → 4 horas (14400s)
post "$KONG_ADMIN/routes/$products_route_id/plugins" \
  --data "name=proxy-cache" \
  --data "config.strategy=memory" \
  --data "config.cache_ttl=14400" >/dev/null || true

# orders/:id → 30 dias (2592000s)
post "$KONG_ADMIN/routes/$orders_route_id/plugins" \
  --data "name=proxy-cache" \
  --data "config.strategy=memory" \
  --data "config.cache_ttl=2592000" >/dev/null || true

# payments/types → infinito 
post "$KONG_ADMIN/routes/$payments_route_id/plugins" \
  --data "name=proxy-cache" \
  --data "config.strategy=memory" \
  --data "config.cache_ttl=0" >/dev/null || true

echo "Cache per route applied."
echo "Kong init finished."
exit 0
