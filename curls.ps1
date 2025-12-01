Write-Host "=== Testes de rotas via Kong (URLs diretas) ===`n"


############################################################
# USERS SERVICE
############################################################

Write-Host "`n--- USERS: Get all users ---"
curl "http://localhost:8000/user-service/v1/clients"
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- USERS: Get user by ID ---"
curl "http://localhost:8000/user-service/v1/clients/1"
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- USERS: Create user ---"
curl -Method POST `
     -Uri "http://localhost:8000/user-service/v1/clients" `
     -ContentType "application/json" `
     -Body '{"name":"teste","email":"teste@example.com"}'
Read-Host "Pressione ENTER para continuar..."


############################################################
# PRODUCTS SERVICE
############################################################

Write-Host "`n--- PRODUCTS: Get all products ---"
curl "http://localhost:8000/product-service/v1/products"
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- PRODUCTS: Get product by ID ---"
curl "http://localhost:8000/product-service/v1/products/1"
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- PRODUCTS: Create product ---"
curl -Method POST `
     -Uri "http://localhost:8000/product-service/v1/products" `
     -ContentType "application/json" `
     -Body '{"name":"Chinelo","price":49.9,"stock":10}'
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- PRODUCTS: Update product ---"
curl -Method PATCH `
     -Uri "http://localhost:8000/product-service/v1/products/1" `
     -ContentType "application/json" `
     -Body '{ "name": "Chinelo Premium", "price": 59.9 }'
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- PRODUCTS: Update stock ---"
curl -Method PATCH `
     -Uri "http://localhost:8000/product-service/v1/products/1/stock" `
     -ContentType "application/json" `
     -Body '{ "stockDelta": -1 }'
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- PRODUCTS: Delete product ---"
curl -Method DELETE "http://localhost:8000/product-service/v1/products/1"
Read-Host "Pressione ENTER para continuar..."


############################################################
# ORDERS SERVICE
############################################################

Write-Host "`n--- ORDERS: Get all orders ---"
curl "http://localhost:8000/order-service/v1/orders"
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- ORDERS: Get order by ID ---"
curl "http://localhost:8000/order-service/v1/orders/1"
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- ORDERS: Create order ---"
curl -Method POST `
     -Uri "http://localhost:8000/order-service/v1/orders" `
     -ContentType "application/json" `
     -Body '{ "userId": 1, "products":[{"productId":1,"quantity":1}]}'
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- ORDERS: Update order status ---"
curl -Method PATCH `
     -Uri "http://localhost:8000/order-service/v1/orders/1/status" `
     -ContentType "application/json" `
     -Body '{ "status":"PAID" }'
Read-Host "Pressione ENTER para continuar..."


############################################################
# PAYMENTS SERVICE
############################################################

Write-Host "`n--- PAYMENTS: Create payment ---"
curl -Method POST `
     -Uri "http://localhost:8000/payment-service/v1/payments" `
     -ContentType "application/json" `
     -Body '{ "orderId": 1, "method": "credit_card" }'
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- PAYMENTS: Get payment by ID ---"
curl "http://localhost:8000/payment-service/v1/payments/1" ##lembre-se de passar o ID certo
Read-Host "Pressione ENTER para continuar..."

Write-Host "`n--- PAYMENTS: Process payment ---"
curl -Method PATCH `
     -Uri "http://localhost:8000/payment-service/v1/payments/1/process" `
     -ContentType "application/json"
Read-Host "Pressione ENTER para continuar..."


Write-Host "`n=== FINALIZADO ==="
