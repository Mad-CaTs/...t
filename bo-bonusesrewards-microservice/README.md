# bo-bonus-rewards-microservice

## Car Bonus

Sistema de recompensas para socios que alcanzan ciertos rangos. Se les otorga la facilidad de obtener un auto o pagarlo a cuotas con ayuda de la empresa.

### Prequalifications API

Sistema de precalificaciones de miembros. Permite obtener miembros que cumplen criterios específicos de rango, período y ciclos de requalificación mínimos, además de exportar y buscar con paginación.

#### GET - Exportar precalificaciones a Excel
```bash
curl -X GET "/api/v1/bonus/prequalifications/export?periodMin=1&periodMax=12&rankId=5&minRequalifications=3"
```

**Parámetros requeridos:**
- `periodMin` (Long) - Período mínimo
- `periodMax` (Long) - Período máximo
- `rankId` (Long) - ID del rango
- `minRequalifications` (Long) - Mínimo de ciclos de requalificación

**Respuesta:** Archivo Excel descargable con encabezados apropiados.

**Validaciones:**
- Todos los parámetros son requeridos y deben ser positivos
- `periodMin` debe ser menor o igual a `periodMax`
- `rankId` debe existir en el sistema

**Errores:**
- 400: Parámetros inválidos (valores negativos, periodMin > periodMax)
- 404: No se encontraron precalificaciones para exportar
- 500: Error interno

---

#### GET - Buscar precalificaciones (paginado y filtrado)
```bash
curl -X GET "/api/v1/bonus/prequalifications/search?periodMin=1&periodMax=12&rankId=5&minRequalifications=3&page=0&size=20"
```

**Parámetros requeridos:**
- `periodMin` (Long) - Período mínimo
- `periodMax` (Long) - Período máximo
- `rankId` (Long) - ID del rango
- `minRequalifications` (Long) - Mínimo de ciclos de requalificación

**Parámetros opcionales:**
- `page` (Integer) - Página (default: 0)
- `size` (Integer) - Tamaño de página (default: 20)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "content": [
      {
        "memberId": 123,
        "username": "jperez",
        "fullName": "Juan Pérez",
        "countryOfResidence": "Colombia",
        "rankName": "Embajador",
        "currentRankName": "Embajador",
        "achievedPoints": 1500,
        "requiredPoints": 1200,
        "missingPoints": 0,
        "startDate": "2025-01-01",
        "endDate": "2025-12-31",
        "requalificationCycles": 5
      }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 1,
    "pageSize": 20,
    "hasNext": false,
    "hasPrevious": false,
    "first": true,
    "last": true,
    "numberOfElements": 1,
    "sortBy": "totalDirectPoints",
    "sortDirection": "DESC"
  },
  "timestamp": "2025-10-13T00:00:00.000-05:00",
  "status": 200
}
```

**Validaciones:**
- Mismas validaciones del export

**Errores:**
- 400: Parámetros inválidos (formato, page/size negativos, periodMin > periodMax)
- 404: No se encontraron precalificaciones
- 500: Error interno

### Classifications API

Sistema de clasificaciones de miembros basado en criterios de precalificación. Permite clasificar miembros según rangos, períodos y ciclos de requalificación, además de buscar y exportar clasificaciones.

#### POST - Clasificar miembros
```bash
curl -X POST /api/v1/bonus/classifications/123,456 \
  -H "Content-Type: application/json" \
  -d '{
    "periodMin": 1,
    "periodMax": 12,
    "rankId": 5,
    "minRequalifications": 3
  }'
```

**Respuesta:**
```json
{
  "result": true,
  "data": "Members classified successfully",
  "timestamp": "2025-10-13T00:00:00.000-05:00",
  "status": 200
}
```

**Validaciones:**
- Todos los campos son requeridos y deben ser positivos
- `periodMin` debe ser menor o igual a `periodMax`
- `rankId` debe existir en el sistema
- `memberIds` deben ser válidos y existir

**Errores:**
- 400: Validación (campos requeridos, valores inválidos, periodMin > periodMax)
- 404: Miembros o rango no encontrados
- 500: Error interno

---

#### GET - Exportar clasificaciones a Excel
```bash
curl -X GET "/api/v1/bonus/classifications/export?member=juan&rankId=5&notificationStatus=true"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `rankId` (Long) - Filtrar por ID de rango
- `notificationStatus` (Boolean) - Filtrar por estado de notificación

**Respuesta:** Archivo Excel descargable con encabezados apropiados.

**Errores:**
- 400: Parámetros inválidos
- 404: No se encontraron clasificaciones para exportar
- 500: Error interno

---

#### GET - Buscar clasificaciones (paginado y filtrado)
```bash
curl -X GET "/api/v1/bonus/classifications/search?member=juan&rankId=5&notificationStatus=true&page=0&size=20"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `rankId` (Long) - Filtrar por ID de rango
- `notificationStatus` (Boolean) - Filtrar por estado de notificación
- `page` (Integer) - Página (default: 0)
- `size` (Integer) - Tamaño de página (default: 20)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "content": [
      {
        "classificationId": "uuid",
        "memberId": 123,
        "username": "jperez",
        "fullName": "Juan Pérez",
        "countryOfResidence": "Colombia",
        "rankName": "Embajador",
        "currentRankName": "Embajador",
        "achievedPoints": 1500,
        "requiredPoints": 1200,
        "requalificationCycles": 5,
        "classificationDate": "2025-10-13",
        "notificationStatus": true,
        "startDate": "2025-01-01",
        "endDate": "2025-12-31"
      }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 1,
    "pageSize": 20,
    "hasNext": false,
    "hasPrevious": false,
    "first": true,
    "last": true,
    "numberOfElements": 1,
    "sortBy": "classificationDate",
    "sortDirection": "DESC"
  },
  "timestamp": "2025-10-13T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: Parámetros inválidos (formato, page/size negativos)
- 404: No se encontraron clasificaciones
- 500: Error interno

### Car Quotations API

Sistema de gestión de cotizaciones de autos. Permite crear, actualizar, eliminar y aceptar cotizaciones de vehículos incluyendo archivos adjuntos (PDFs de cotizaciones) y toda la información necesaria para el proceso de aprobación de bonos.

**Reglas de negocio:**
- Máximo 2 cotizaciones por clasificación
- Solo una cotización puede estar aceptada por clasificación
- No se pueden editar cotizaciones si ya existe una aceptada para la misma clasificación
- No se puede aceptar una cotización si ya hay otra aceptada para la misma clasificación

#### POST - Crear cotización de auto
```bash
curl -X POST /api/v1/car-bonus/quotations \
--form 'classificationId="550e8400-e29b-41d4-a716-446655440000"' \
--form 'brandName="Toyota"' \
--form 'modelName="Corolla"' \
--form 'color="Rojo"' \
--form 'price="14990.00"' \
--form 'dealershipName="Toyota Centro"' \
--form 'executiveCountryId="1"' \
--form 'salesExecutiveName="Juan Pérez"' \
--form 'salesExecutivePhone="+57 300 123 4567"' \
--form 'quotationFile=@cotizacion.pdf' \
--form 'eventId="456"' \
--form 'initialInstallments="2"'
```

**Parámetros requeridos (form-data):**
- `classificationId` (UUID) - ID de la clasificación del socio
- `brandName` (String) - Nombre de la marca del vehículo
- `modelName` (String) - Nombre del modelo del vehículo
- `color` (String) - Color del vehículo
- `price` (BigDecimal) - Precio del vehículo (máximo 12 dígitos enteros, 2 decimales)
- `dealershipName` (String) - Nombre del concesionario
- `executiveCountryId` (Long) - ID del país del ejecutivo
- `salesExecutiveName` (String) - Nombre del ejecutivo de ventas
- `salesExecutivePhone` (String) - Teléfono del ejecutivo de ventas
- `quotationFile` (File) - Archivo PDF de la cotización
- `eventId` (Long) - ID del evento
- `initialInstallments` (Integer) - Número de cuotas iniciales

**Respuesta:**
```json
{
  "result": true,
  "data": "Quotation created successfully",
  "timestamp": "2025-10-14T00:00:00.000-05:00",
  "status": 200
}
```

**Validaciones:**
- Todos los campos son requeridos
- `price` debe tener máximo 12 dígitos enteros y 2 decimales
- `quotationFile` debe ser un archivo PDF válido
- `classificationId` debe existir y ser válido
- Máximo 2 cotizaciones por clasificación

**Errores:**
- 400: Validación (campos requeridos faltantes, formato inválido, precio con más de 2 decimales)
- 404: Clasificación no encontrada
- 409: Conflicto de negocio (ej: cotización duplicada)
- 422: Ya existe el máximo de 2 cotizaciones para esta clasificación
- 500: Error interno

---

#### PUT - Actualizar cotización de auto
```bash
curl -X PUT /api/v1/car-bonus/quotations/550e8400-e29b-41d4-a716-446655440000 \
--form 'brandName="Toyota"' \
--form 'modelName="Corolla Cross"' \
--form 'color="Azul"' \
--form 'price="15990.00"' \
--form 'dealershipName="Toyota Centro"' \
--form 'executiveCountryId="1"' \
--form 'salesExecutiveName="Juan Pérez"' \
--form 'salesExecutivePhone="+57 300 123 4567"' \
--form 'quotationFile=@cotizacion_actualizada.pdf' \
--form 'eventId="456"' \
--form 'initialInstallments="2"'
```

**Parámetros requeridos (form-data):**
- `brandName` (String) - Nombre de la marca del vehículo
- `modelName` (String) - Nombre del modelo del vehículo
- `color` (String) - Color del vehículo
- `price` (BigDecimal) - Precio del vehículo (máximo 12 dígitos enteros, 2 decimales)
- `dealershipName` (String) - Nombre del concesionario
- `executiveCountryId` (Long) - ID del país del ejecutivo
- `salesExecutiveName` (String) - Nombre del ejecutivo de ventas
- `salesExecutivePhone` (String) - Teléfono del ejecutivo de ventas
- `eventId` (Long) - ID del evento
- `initialInstallments` (Integer) - Número de cuotas iniciales

**Parámetros opcionales:**
- `quotationFile` (File) - Nuevo archivo PDF de la cotización (si no se envía, mantiene el archivo anterior)

**Respuesta:**
```json
{
  "result": true,
  "data": "Quotation updated successfully",
  "timestamp": "2025-10-14T00:00:00.000-05:00",
  "status": 200
}
```

**Validaciones:**
- Todos los campos son requeridos excepto `quotationFile`
- `price` debe tener máximo 12 dígitos enteros y 2 decimales
- `quotationFile` si se envía debe ser un archivo PDF válido
- La cotización debe existir
- No se puede editar si ya existe una cotización aceptada para la misma clasificación

**Errores:**
- 400: Validación (campos requeridos faltantes, formato inválido, precio con más de 2 decimales)
- 404: Cotización no encontrada
- 409: Conflicto de negocio (cotización aceptada existente para la clasificación)
- 500: Error interno

---

#### DELETE - Eliminar cotización de auto
```bash
curl -X DELETE /api/v1/car-bonus/quotations/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta:**
```json
{
  "result": true,
  "data": "Quotation deleted successfully",
  "timestamp": "2025-10-14T00:00:00.000-05:00",
  "status": 200
}
```

**Validaciones:**
- El ID debe ser un UUID válido
- La cotización debe existir

**Errores:**
- 400: ID inválido (formato UUID incorrecto)
- 404: Cotización no encontrada
- 409: No se puede eliminar (referencias existentes)
- 500: Error interno

---

#### POST - Aceptar cotización de auto
```bash
curl -X POST /api/v1/car-bonus/quotations/accept/550e8400-e29b-41d4-a716-446655440000
```

**Parámetros de ruta:**
- `id` (UUID) - ID de la cotización a aceptar

**Respuesta:**
```json
{
  "result": true,
  "data": "Quotation accepted successfully",
  "timestamp": "2025-10-14T00:00:00.000-05:00",
  "status": 200
}
```

**Validaciones:**
- El ID debe ser un UUID válido
- La cotización debe existir
- No debe existir otra cotización aceptada para la misma clasificación

**Errores:**
- 400: ID inválido (formato UUID incorrecto)
- 404: Cotización no encontrada
- 409: Ya existe una cotización aceptada para esta clasificación
- 500: Error interno

### Car Quotation Details API

Sistema de consulta de detalles de cotizaciones de autos. Permite obtener información completa de cotizaciones asociadas a una clasificación específica.

#### GET - Obtener detalles de cotización por ID de clasificación
```bash
curl -X GET "/api/v1/car-bonus/quotations/details/550e8400-e29b-41d4-a716-446655440000"
```

**Parámetros de ruta:**
- `classificationId` (UUID) - ID de la clasificación

**Respuesta:**
```json
{
  "result": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "classificationId": "550e8400-e29b-41d4-a716-446655440000",
      "memberId": 123,
      "username": "jperez",
      "memberName": "Juan Pérez",
      "brand": "Toyota",
      "model": "Corolla",
      "color": "Rojo",
      "price": 14990.00,
      "dealership": "Toyota Centro",
      "executiveCountryId": 167,
      "salesExecutive": "Juan Pérez",
      "prefixPhone": "+51",
      "salesExecutivePhone": "900000000",
      "quotationUrl": "https://...pdf",
      "initialInstallments": 2,
      "eventId": 456,
      "eventName": "Evento Especial 2025",
      "isAccepted": false,
      "acceptedAt": null
    }
  ],
  "timestamp": "2025-10-14T00:00:00.000-05:00",
  "status": 200
}
```

**Validaciones:**
- `classificationId` debe ser un UUID válido
- La clasificación debe existir en el sistema

**Errores:**
- 400: ID de clasificación inválido (formato UUID incorrecto)
- 404: Clasificación no encontrada o no tiene cotizaciones asociadas
- 500: Error interno

### Car Brands API

#### GET - Listar marcas
```bash
curl -X GET /api/v1/car-bonus/brands
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "Toyota"}
  ]
}
```

**Errores:**
- 500: Error interno

---

#### GET - Buscar marca
```bash
curl -X GET "/api/v1/car-bonus/brands/search?name=Toyota"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "Toyota"}
  ]
}
```

**Errores:**
- 400: Parámetro faltante
- 500: Error interno

---

#### POST - Crear marca
```bash
curl -X POST /api/v1/car-bonus/brands \
  -H "Content-Type: application/json" \
  -d '{"name": "Ferrari"}'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {"id": 2, "name": "Ferrari"}
}
```

**Errores:**
- 400: Validación (name min 2 caracteres)
- 409: Marca ya existe
- 500: Error interno

---

#### PUT - Actualizar marca
```bash
curl -X PUT /api/v1/car-bonus/brands/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Toyota Motors"}'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {"id": 1, "name": "Toyota Motors"}
}
```

**Errores:**
- 400: ID inválido o validación
- 404: Marca no encontrada
- 409: Marca ya existe
- 500: Error interno

---

#### DELETE - Eliminar marca
```bash
curl -X DELETE /api/v1/car-bonus/brands/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": "Car brand deleted successfully"
}
```

**Errores:**
- 400: ID inválido
- 404: Marca no encontrada
- 409: Marca referenciada por otros registros
- 500: Error interno

### Car Models API

#### GET - Listar modelos
```bash
curl -X GET /api/v1/car-bonus/models
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "Corolla", "brandId": 1}
  ]
}
```

**Errores:**
- 500: Error interno

---

#### GET - Buscar modelo
```bash
curl -X GET "/api/v1/car-bonus/models/search?brandId=1&name=Corolla"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "Corolla", "brandId": 1}
  ]
}
```

**Errores:**
- 400: Parámetros faltantes
- 500: Error interno

---

#### POST - Crear modelo
```bash
curl -X POST /api/v1/car-bonus/models \
  -H "Content-Type: application/json" \
  -d '{"name": "Camry", "brandId": 1}'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {"id": 2, "name": "Camry", "brandId": 1}
}
```

**Errores:**
- 400: Validación (name min 2 caracteres, brandId requerido) o marca no existe
- 409: Modelo ya existe
- 500: Error interno

---

#### PUT - Actualizar modelo
```bash
curl -X PUT /api/v1/car-bonus/models/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Corolla Cross", "brandId": 1}'
```

**Respuesta:**
```json
{
  "result": true,
  "data": {"id": 1, "name": "Corolla Cross", "brandId": 1}
}
```

**Errores:**
- 400: ID inválido, validación o marca no existe
- 404: Modelo no encontrado
- 409: Modelo ya existe
- 500: Error interno

---

#### DELETE - Eliminar modelo
```bash
curl -X DELETE /api/v1/car-bonus/models/1
```

**Respuesta:**
```json
{
  "result": true,
  "data": "Car model deleted successfully"
}
```

**Errores:**
- 400: ID inválido
- 404: Modelo no encontrado
- 409: Modelo referenciado por otros registros
- 500: Error interno


### Assignments API

#### POST - Crear asignación de auto
```bash
curl -X POST /api/v1/car-bonus/assignments/create \
--form 'car.brandId="1"' \
--form 'car.modelId="1"' \
--form 'car.color="Rojo"' \
--form 'car.image=@car.jpg' \
--form 'assignment.memberId="34131"' \
--form 'assignment.price="14990"' \
--form 'assignment.interestRate="13.99"' \
--form 'assignment.initialInstallmentsCount="2"' \
--form 'assignment.monthlyInstallmentsCount="60"' \
--form 'assignment.paymentStartDate="2025-10-28"'
```


**Respuesta:**
```json
{
  "result": true,
  "data": "Car assignment created successfully"
}
```

**Errores:**
- 400: Validación (campos requeridos, valores positivos, formato)
- 404: Miembro, marca o modelo no encontrado
- 409: Asignación ya existe o conflicto de negocio
- 500: Error interno


### Car Assignment Details API

#### GET - Obtener detalle de asignación por ID
```bash
curl -X GET "/api/v1/car-bonus/cars/details/{id}"
```


**Respuesta:**
```json
{
  "result": true,
  "data": {
    "carAssignmentId": "uuid",
    "memberId": 123,
    "brand": {
      "id": 1,
      "name": "Toyota"
    },
    "model": {
      "id": 2,
      "name": "Corolla",
      "brandId": 1
    },
    "color": "Rojo",
    "imageUrl": "https://...",
    "price": 14990.00,
    "interestRate": 13.99,
    "companyInitial": 5000.00,
    "memberInitial": 2000.00,
    "initialInstallmentsCount": 2,
    "monthlyInstallmentsCount": 60,
    "paymentStartDate": "2025-10-28",
    "isAssigned": true,
    "assignedDate": "2025-10-29 10:00:00"
  },
  "timestamp": "2025-10-03T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: ID inválido (UUID incorrecto)
- 404: Asignación no encontrada
- 500: Error interno

---

#### GET - Buscar asignaciones con detalles (paginado y filtrado)
```bash
curl -X GET "/api/v1/car-bonus/assignments/details/search?brandName=toyota&modelName=corolla&startDate=2025-09-24&endDate=2025-09-25&page=0&size=10"
```

**Parámetros opcionales:**
- `brandName` (String) - Filtrar por nombre de marca
- `modelName` (String) - Filtrar por nombre de modelo
- `startDate` (Date) - Fecha inicio (YYYY-MM-DD)
- `endDate` (Date) - Fecha fin (YYYY-MM-DD)
- `page` (Integer) - Página (default: 0)
- `size` (Integer) - Tamaño de página (default: 20)


**Respuesta:**
```json
{
  "result": true,
  "data": {
    "content": [
      {
        "carAssignmentId": "uuid",
        "memberId": 123,
        "brand": {
          "id": 1,
          "name": "Toyota"
        },
        "model": {
          "id": 2,
          "name": "Corolla",
          "brandId": 1
        },
        "color": "Rojo",
        "imageUrl": "https://...",
        "price": 14990.00,
        "interestRate": 13.99,
        "companyInitial": 5000.00,
        "memberInitial": 2000.00,
        "initialInstallmentsCount": 2,
        "monthlyInstallmentsCount": 60,
        "paymentStartDate": "2025-10-28",
        "isAssigned": true,
        "assignedDate": "2025-10-29 10:00:00"
      }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 1,
    "pageSize": 10,
    "hasNext": false,
    "hasPrevious": false,
    "first": true,
    "last": true,
    "numberOfElements": 1,
    "sortBy": "created_at",
    "sortDirection": "DESC"
  },
  "timestamp": "2025-10-03T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: Parámetros inválidos (formato, fechas, paginación)
- 500: Error interno

### Car Assignments Active API

#### GET - Exportar todas las asignaciones activas (Excel)
```bash
curl -X GET "/api/v1/car-bonus/assignments/active/export"
```

**Descripción:** Exporta todas las asignaciones activas en formato Excel.

**Errores:**
- 404: No se encontraron asignaciones activas
- 500: Error interno

---

#### GET - Buscar asignaciones activas (paginado y filtrado)
```bash
curl -X GET "/api/v1/car-bonus/assignments/active/search?member=juan&modelName=corolla&startDate=2025-09-24&endDate=2025-10-03&page=0&size=10"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `modelName` (String) - Filtrar por modelo
- `startDate` (Date) - Fecha inicio (YYYY-MM-DD)
- `endDate` (Date) - Fecha fin (YYYY-MM-DD)
- `page` (Integer) - Página (default: 0)
- `size` (Integer) - Tamaño de página (default: 20)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "content": [
      {
        "carAssignmentId": "uuid",
        "memberId": 123,
        "memberFullName": "Juan Pérez",
        "username": "jperez",
        "brandName": "Toyota",
        "modelName": "Corolla",
        "priceUsd": 14990.00,
        "totalInitialInstallments": 2,
        "paidInitialInstallments": 2,
        "totalMonthlyInstallments": 60,
        "paidMonthlyInstallments": 10,
        "assignedMonthlyBonusUsd": 250.00,
        "monthlyInstallmentUsd": 200.00,
        "currentRankName": "Embajador",
        "assignedDate": "2025-10-03 10:00:00"
      }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 1,
    "pageSize": 20,
    "hasNext": false,
    "hasPrevious": false,
    "first": true,
    "last": true,
    "numberOfElements": 1,
    "sortBy": "assigned_date",
    "sortDirection": "DESC"
  },
  "timestamp": "2025-10-03T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: Parámetros inválidos (formato, fechas, paginación)
- 404: No se encontraron resultados para los filtros aplicados
- 500: Error interno

### Car Rank Bonuses API

Sistema de bonificaciones por rango de socio. Permite gestionar bonos específicos para cada rango, controlando que solo exista un bono activo por rango a la vez.

**Concepto clave:** Solo puede existir **un bono activo por rango** en cualquier momento. Esto garantiza que cada rango tenga una bonificación única y no haya conflictos.

#### POST - Crear bono por rango
```bash
curl -X POST /api/v1/car-bonus/rank-bonuses \
  -H "Content-Type: application/json" \
  -d '{
    "rankId": 12,
    "monthlyAssignedBonus": 2500.00,
    "initialBonus": 5000.00,
    "bonusPrice": 4000.00,
    "issueDate": "2025-09-28",
    "expirationDate": "2025-12-31"
  }'
```

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "id": "e00e1fe0-8a31-49aa-8577-c5938cc6a8e2",
    "rankId": 12,
    "monthlyAssignedBonus": 2500.00,
    "initialBonus": 5000.00,
    "bonusPrice": 4000.00,
    "issueDate": "2025-09-28",
    "expirationDate": "2025-12-31",
    "statusId": 1
  },
  "timestamp": "2025-09-29T11:43:13.043-05:00",
  "status": 201
}
```

**Validaciones automáticas:**
- **Unicidad por rango**: Verifica que no exista otro bono activo para el mismo `rankId`
- **Campos requeridos**: Todos los campos son obligatorios
- **Montos positivos**: `monthlyAssignedBonus`, `initialBonus` y `bonusPrice` > 0
- **Fechas válidas**: `expirationDate` debe ser posterior a `issueDate`
- **Rango existente**: Valida que el `rankId` exista en el sistema
- **Horarios automáticos**: `issueDate` inicia a 00:00:00, `expirationDate` termina a 23:59:59

**Errores:**
- 400: Validación (campos requeridos, montos <= 0, fechas inválidas)
- 404: Rango no encontrado
- 422: Ya existe un bono activo para este rango
- 500: Error interno

---

#### PUT - Actualizar bono por rango
```bash
curl -X PUT /api/v1/car-bonus/rank-bonuses/e00e1fe0-8a31-49aa-8577-c5938cc6a8e2 \
  -H "Content-Type: application/json" \
  -d '{
    "rankId": 12,
    "monthlyAssignedBonus": 3000.00,
    "initialBonus": 6000.00,
    "bonusPrice": 5000.00,
    "issueDate": "2025-09-29",
    "expirationDate": "2025-12-31"
  }'
```

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "id": "e00e1fe0-8a31-49aa-8577-c5938cc6a8e2",
    "rankId": 12,
    "monthlyAssignedBonus": 3000.00,
    "initialBonus": 6000.00,
    "bonusPrice": 5000.00,
    "issueDate": "2025-09-29",
    "expirationDate": "2025-12-31",
    "statusId": 1
  },
  "timestamp": "2025-09-29T11:43:13.043-05:00",
  "status": 200
}
```

**Lógica de actualización inteligente:**
- Si NO se usa en cronogramas se actualiza directamente los valores
- Si YA se usa en cronogramas: 
  - Marca el bono actual como `SUPERSEDED` (estado 3)
  - Crea un nuevo bono con los nuevos valores y estado `ACTIVE` (estado 1)
  - Los cronogramas existentes siguen usando el bono anterior (no se afectan)

**Validaciones automáticas:**
- Solo bonos activos: Solo se pueden actualizar bonos con `statusId = 1`
- Mismas validaciones del CREATE: Campos, montos, fechas, unicidad
- Existencia: Verifica que el bono exista

**Errores:**
- 400: ID inválido, validación o rango no existe
- 404: Bono no encontrado
- 409: Bono no es activo (ya expirado, supersedido o cancelado)
- 500: Error interno

---

#### DELETE - Eliminar bono por rango
```bash
curl -X DELETE /api/v1/car-bonus/rank-bonuses/e00e1fe0-8a31-49aa-8577-c5938cc6a8e2
```

**Respuesta:**
```json
{
  "result": true,
  "data": "Car rank bonus deleted successfully",
  "timestamp": "2025-09-29T11:43:13.043-05:00",
  "status": 200
}
```

**Lógica de eliminación inteligente:**
- Si NO se usa en cronogramas: Elimina físicamente el registro de la base de datos
- Si YA se usa en cronogramas:
  - Marca el bono como `SUPERSEDED` (estado 3) en lugar de eliminarlo físicamente
  - Los cronogramas existentes siguen funcionando normalmente
  - El bono queda "inactivo" pero preserva la integridad referencial
  - Nota: No se puede distinguir si llegó a SUPERSEDED por actualización o eliminación

**Validaciones automáticas:**
- Solo bonos activos: Solo se pueden eliminar bonos con `statusId = 1`
- Existencia: Verifica que el bono exista

**Errores:**
- 400: ID inválido (formato UUID incorrecto)
- 404: Bono no encontrado
- 409: Bono no es activo (ya expirado, supersedido o cancelado)
- 500: Error interno

**Estados de bonos:**
- `statusId: 1` - **ACTIVE**: Bono vigente y usable
- `statusId: 2` - **EXPIRED**: Bono que alcanzó su fecha de expiración
- `statusId: 3` - **SUPERSEDED**: Bono reemplazado por actualización (ya no se usa para nuevos cronogramas)
- `statusId: 4` - **CANCELLED**: Bono cancelado por eliminación (ya no se usa para nuevos cronogramas, pero se preserva por integridad referencial)

---

#### GET - Obtener bono activo por ID de miembro
```bash
curl -X GET /api/v1/car-bonus/rank-bonuses/member/{id}
```

**Descripción:** 
Endpoint para el frontend que permite obtener el bono de rango activo de un miembro específico. Útil para autocompletar formularios con los datos del bono según el miembro seleccionado.

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "id": "e00e1fe0-8a31-49aa-8577-c5938cc6a8e2",
    "rankId": 12,
    "monthlyAssignedBonus": 2500.00,
    "initialBonus": 5000.00,
    "bonusPrice": 4000.00,
    "issueDate": "2025-09-28",
    "expirationDate": "2025-12-31",
    "statusId": 1
  },
  "timestamp": "2025-10-01T10:30:00.000-05:00",
  "status": 200
}
```

**Lógica interna:**
1. Busca el `MemberRankDetail` del miembro para obtener su `rankId`
2. Busca el `CarRankBonus` activo (`statusId = 1`) para ese rango
3. Retorna todos los datos del bono para uso en formularios

**Casos de uso:**
- Autocompletar formularios de creación de autos y/o cronograma

**Errores:**
- 400: ID de miembro inválido
- 404: Miembro no encontrado o no tiene bono activo asignado para su rango
- 500: Error interno

---

#### GET - Obtener detalle de bono por rango
```bash
curl -X GET /api/v1/car-bonus/rank-bonuses/details/{id}
```

**Respuesta:**
```json
{
    "result": true,
    "data": {
        "id": "2ef4b7b3-6ef1-49e3-bce5-202803aca84f",
        "monthlyAssignedBonus": 2500.00,
        "initialBonus": 5000.00,
        "bonusPrice": 4000.00,
        "issueDate": "2025-09-28",
        "expirationDate": "2025-10-07",
        "status": {
            "id": 1,
            "name": "ACTIVE"
        },
        "rank": {
            "id": 12,
            "name": "Embajador de Marca"
        }
    },
    "timestamp": "2025-09-29T12:36:46.858-05:00",
    "status": 200
}
```

**Errores:**
- 400: ID inválido (formato UUID incorrecto)
- 404: Bono no encontrado
- 500: Error interno

---

#### GET - Buscar detalles de bonos por rango (filtrado avanzado y paginado)
```bash
curl -X GET '/api/v1/car-bonus/rank-bonuses/details/search?startDate=2025-09-27&endDate=2025-09-27&rankId=12&onlyActive=false&page=0&size=10'
```

**Parámetros de búsqueda (todos opcionales):**
- `startDate`: Fecha inicial (YYYY-MM-DD)
- `endDate`: Fecha final (YYYY-MM-DD)
- `rankId`: ID del rango
- `onlyActive`: Si es `true` solo trae bonos activos, si es `false` trae los expirados/no activos
- `page`: Página (default 0)
- `size`: Tamaño de página (default 20)

**Respuesta:**
```json
{
    "result": true,
    "data": {
        "content": [
            {
                "id": "40d9fd15-03b1-4214-b467-8e4df31c850c",
                "monthlyAssignedBonus": 2500.00,
                "initialBonus": 5000.00,
                "bonusPrice": 4000.00,
                "issueDate": "2025-09-28",
                "expirationDate": "2025-10-07",
                "status": {
                    "id": 3,
                    "name": "SUPERSEDED"
                },
                "rank": {
                    "id": 12,
                    "name": "Embajador de Marca"
                }
            },
            {
                "id": "e00e1fe0-8a31-49aa-8577-c5938cc6a8e2",
                "monthlyAssignedBonus": 2500.00,
                "initialBonus": 5000.00,
                "bonusPrice": 4000.00,
                "issueDate": "2025-09-28",
                "expirationDate": "2025-09-28",
                "status": {
                    "id": 1,
                    "name": "ACTIVE"
                },
                "rank": {
                    "id": 12,
                    "name": "Embajador de Marca"
                }
            }
        ],
        "currentPage": 0,
        "totalPages": 1,
        "totalElements": 2,
        "pageSize": 10,
        "hasNext": false,
        "hasPrevious": false,
        "first": true,
        "last": true,
        "numberOfElements": 2,
        "sortBy": "created_at",
        "sortDirection": "DESC"
    },
    "timestamp": "2025-09-29T12:03:16.174-05:00",
    "status": 200
}
```

**Errores:**
- 400: Parámetros inválidos (formato, page/size negativos)
- 404: Bonos no encontrados
- 500: Error interno

### Car Payment Schedules API

#### POST - Crear cronograma de pagos para una asignación
```bash
curl -X POST \
  http://localhost:8716/api/v1/car-bonus/schedules/installments/{carAssignmentId} \
  -H "Content-Type: application/json" \
  -d '{
    "gpsAmount": 100.00,
    "insuranceAmount": 200.00,
    "mandatoryInsuranceAmount": 50.00
  }'
```

**Request Body:**
```json
{
  "gpsAmount": 100.00,
  "insuranceAmount": 200.00,
  "mandatoryInsuranceAmount": 50.00
}
```

**Respuesta:**
```json
{
  "result": true,
  "data": "Installments created successfully",
  "timestamp": "2025-10-03T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: Validación de campos (valores negativos, nulos o formato incorrecto)
- 404: Asignación de auto no encontrada
- 409: Ya existen cuotas generadas para esta asignación
- 500: Error interno