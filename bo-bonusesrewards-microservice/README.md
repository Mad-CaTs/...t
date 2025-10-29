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

---

#### GET - Obtener detalles de clasificación por miembro y tipo de bono
```bash
curl -X GET "/api/v1/bonus/classifications/member/123/bonus-type/car"
```

**Parámetros de ruta requeridos:**
- `memberId` (Long) - ID del miembro
- `bonusType` (String) - Tipo de bono (ej: CAR)

**Respuesta:**
```json
{
    "result": true,
    "data": [
        {
            "classificationId": null,
            "carAssignmentId": null,
            "rankId": 14,
            "rankName": "TRIPLE DIAMANTE",
            "maxAchievedPoints": 0,
            "requiredPoints": 0,
            "initialBonus": 25000.00,
            "monthlyBonus": 1500.00,
            "bonusPrice": 337500.00,
            "options": []
        },
        {
            "classificationId": null,
            "carAssignmentId": null,
            "rankId": 8,
            "rankName": "DIAMANTE",
            "maxAchievedPoints": 0,
            "requiredPoints": 5040,
            "initialBonus": 7000.00,
            "monthlyBonus": 550.00,
            "bonusPrice": 30900.00,
            "options": [
                {
                    "optionNumber": 1,
                    "cycles": 0,
                    "achievedPoints": 0,
                    "requiredPoints": 5040,
                    "isAchieved": false
                },
                { "...": "more items" }
            ]
        },
        {
            "classificationId": "uuid",
            "carAssignmentId": "uuid",
            "rankId": 6,
            "rankName": "Esmeralda",
            "maxAchievedPoints": 4707,
            "requiredPoints": 900,
            "initialBonus": 2000.00,
            "monthlyBonus": 250.00,
            "bonusPrice": 12990.00,
            "options": [
                {
                    "optionNumber": 7,
                    "cycles": 18,
                    "achievedPoints": 4707,
                    "requiredPoints": 900,
                    "isAchieved": true
                },
                { "...": "more items" }
            ]
        },
        { "...": "more items" }
    ],
    "timestamp": "2025-10-15T17:27:49.830-05:00",
    "status": 200
}
```

**Notas importantes sobre los campos de respuesta:**

- `classificationId`: Es `null` cuando el miembro no tiene una clasificación activa asignada para ese rango específico. Una clasificación es un registro manual creado por el equipo de soporte que indica que el miembro ha sido aprobado y clasificado para acceder a los bonos de ese rango. Puede ser `null` por dos razones principales:
  - El miembro no ha cumplido con los requisitos mínimos (puntos, volumen de ventas, etc.) para calificar a ese rango.
  - El miembro sí cumplió los requisitos, pero aún no lo ha clasificado formalmente en el sistema, por lo que no se le ha asignado un ID de clasificación.

- `carAssignmentId`: Puede ser `null` en los siguientes casos:
  - El miembro aún no ha alcanzado el nivel requerido.
  - El miembro no ha sido clasificado.
  - Aún no se le ha asignado un vehículo en el sistema.

- `maxAchievedPoints`: Es `0` cuando no existen datos de puntos logrados para ese rango en la clasificación del miembro. Esto indica que el miembro no ha acumulado puntos en ese nivel específico del programa de bonos.

- `requiredPoints`: Es `0` cuando no hay requisitos de puntos definidos para ese rango en el sistema. Esto puede ocurrir para rangos superiores donde los requisitos aún no han sido configurados, o para rangos que no requieren puntos específicos.

- `options`: Está vacío (`[]`) cuando no hay opciones de pago o ciclos definidos para ese rango. Esto significa que el rango no tiene configuradas las opciones de pago mensuales o requisitos específicos, lo que indica que el miembro no puede acceder a bonos en ese nivel hasta que se configuren los parámetros correspondientes.

**Validaciones:**
- `memberId` debe ser un número positivo y existir en el sistema
- `bonusType` debe ser un tipo de bono válido (ej: car)

**Errores:**
- 400: Parámetros inválidos (memberId no numérico, bonusType inválido)
- 404: No hay requerimientos para el tipo de bono especificado
- 500: Error interno

---

#### POST - Notificar miembros clasificados
```bash
curl -X POST "/api/v1/bonus/classifications/notify/uuid,uuid"
```

**Descripción:**
Envía notificaciones a los miembros asociados a las clasificaciones especificadas por sus IDs.

**Parámetros de ruta requeridos:**
- `classificationIds` (List<UUID>) - Lista de IDs de clasificación separados por comas

**Respuesta:**
```json
{
  "result": true,
  "data": "Members notified successfully",
  "timestamp": "2025-10-23T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: ID(s) de clasificación inválido(s) (formato UUID incorrecto)
- 404: Una o más clasificaciones no encontradas
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

**Errores:**
- 404: No se encontraron asignaciones pendientes
- 500: Error interno

### Car Quotation Pending Assignments API

#### GET - Obtener todas las asignaciones pendientes de asignación de vehículo
```bash
curl -X GET "/api/v1/car-bonus/quotations/details/pending-assignments"
```

**Respuesta:**
```json
{
  "result": true,
  "data": [
    {
      "quotationId": "550e8400-e29b-41d4-a716-446655440001",
      "username": "jperez",
      "memberFullName": "Juan Pérez",
      "rankName": "Embajador"
    },
    {
      "quotationId": "550e8400-e29b-41d4-a716-446655440002",
      "username": "mgarcia",
      "memberFullName": "María García",
      "rankName": "Esmeralda"
    }
  ],
  "timestamp": "2025-10-17T14:30:00.000-05:00",
  "status": 200
}
```

### Car Quotation Summary API

Sistema de consulta de resúmenes de cotizaciones de autos. Permite obtener información resumida de cotizaciones con filtros y paginación, además de exportar a Excel.

#### GET - Buscar resúmenes de cotizaciones (paginado y filtrado)
```bash
curl -X GET "/api/v1/car-bonus/quotations/details?member=juan&rankId=5&isReviewed=true&page=0&size=20"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `rankId` (Long) - Filtrar por ID de rango
- `isReviewed` (Boolean) - Filtrar por estado de revisión (true: revisadas, false: no revisadas)
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
        "memberFullName": "Juan Pérez",
        "countryOfResidence": "Colombia",
        "rankId": 5,
        "rankName": "Embajador",
        "lastQuotationDate": "2025-10-15 10:30:00",
        "reviewed": true
      },
      { "...": "more items" }
    ]
  },
  "timestamp": "2025-10-15T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: Parámetros inválidos (formato, page/size negativos)
- 404: No se encontraron resúmenes de cotizaciones
- 500: Error interno

---

#### GET - Exportar resúmenes de cotizaciones a Excel
```bash
curl -X GET "/api/v1/car-bonus/quotations/details/export?member=juan&rankId=5&isReviewed=true"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `rankId` (Long) - Filtrar por ID de rango
- `isReviewed` (Boolean) - Filtrar por estado de revisión (true: revisadas, false: no revisadas)

**Respuesta:** Archivo Excel descargable con encabezados apropiados.

**Contenido del Excel:**
- Username
- Nombre Completo
- País de Residencia
- Rango
- Fecha de Última Cotización
- Estado de Revisión

**Errores:**
- 400: Parámetros inválidos
- 404: No se encontraron resúmenes de cotizaciones para exportar
- 500: Error interno

### Car Quotation Selected API

Sistema de consulta de cotizaciones seleccionadas (aceptadas). Permite obtener información de cotizaciones aceptadas con filtros y paginación, además de exportar a Excel.

#### GET - Buscar cotizaciones seleccionadas (paginado y filtrado)
```bash
curl -X GET "/api/v1/car-bonus/quotations/details/selected?member=juan&rankId=5&page=0&size=20"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `rankId` (Long) - Filtrar por ID de rango
- `page` (Integer) - Página (default: 0)
- `size` (Integer) - Tamaño de página (default: 20)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "content": [
      {
        "quotationId": "uuid",
        "memberId": 123,
        "username": "jperez",
        "memberFullName": "Juan Pérez",
        "countryOfResidence": "Colombia",
        "rankId": 5,
        "rankName": "Embajador",
        "acceptedAt": "2025-10-15 10:30:00",
        "quotationUrl": "https://..."
      },
      { "...": "more items" }
    ]
  },
  "timestamp": "2025-10-15T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: Parámetros inválidos (formato, page/size negativos)
- 404: No se encontraron cotizaciones seleccionadas
- 500: Error interno

---

#### GET - Exportar cotizaciones seleccionadas a Excel
```bash
curl -X GET "/api/v1/car-bonus/quotations/details/selected/export?member=juan&rankId=5"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `rankId` (Long) - Filtrar por ID de rango

**Respuesta:** Archivo Excel descargable con encabezados apropiados.

**Contenido del Excel:**
- Username
- Nombre Completo
- País de Residencia
- Rango
- Fecha de Aceptación
- URL de Cotización

**Errores:**
- 400: Parámetros inválidos
- 404: No se encontraron cotizaciones seleccionadas para exportar
- 500: Error interno

### Car Quotation Details API

Sistema de consulta de detalles de cotizaciones de autos. Permite obtener información completa de cotizaciones asociadas a una clasificación específica.

#### GET - Obtener detalles de cotización por ID de clasificación
```bash
curl -X GET "/api/v1/car-bonus/quotations/details/{classificationId}"
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
    },
    { "...": "more items" }
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
--form 'assignment.quotationId="uuid"' \
--form 'assignment.price="14990"' \
--form 'assignment.interestRate="13.99"' \
--form 'assignment.initialInstallmentsCount="2"' \
--form 'assignment.monthlyInstallmentsCount="60"' \
--form 'assignment.paymentStartDate="2025-10-28"'
```

**Parámetros requeridos (form-data):**
- `car.brandId` (Long) - ID de la marca del vehículo
- `car.modelId` (Long) - ID del modelo del vehículo  
- `car.color` (String) - Color del vehículo
- `assignment.price` (BigDecimal) - Precio del vehículo
- `assignment.interestRate` (BigDecimal) - Tasa de interés
- `assignment.initialInstallmentsCount` (Integer) - Número de cuotas iniciales
- `assignment.monthlyInstallmentsCount` (Integer) - Número de cuotas mensuales
- `assignment.paymentStartDate` (Date) - Fecha de inicio de pagos

**Parámetros opcionales (form-data):**
- `car.image` (File) - Imagen del vehículo (archivo)
- `assignment.quotationId` (UUID) - ID de la cotización asociada

**Respuesta:**
```json
{
  "result": true,
  "data": "Car assignment created successfully"
}
```

**Validaciones:**
- Todos los campos requeridos deben ser positivos y válidos
- `brandId` y `modelId` deben existir en el sistema
- `quotationId` si se proporciona debe ser un UUID válido y existir
- Si se proporciona `quotationId`, debe tener un bono de rango activo

**Reglas de negocio:**
- Si se incluye `quotationId`, se crean automáticamente los cronogramas de pago iniciales
- Si no se incluye `quotationId`, solo se guarda la asignación sin cronogramas

**Errores:**
- 400: Validación (campos requeridos, valores positivos, formato, día de pago fuera de rango 1-28)
- 404: Miembro, marca, modelo, cotización o clasificación no encontrada
- 409: Asignación ya existe o conflicto de negocio
- 422: La proforma debe ser aceptada para poder crear la asignación
- 500: Error interno

---

#### PUT - Actualizar asignación de auto
```bash
curl -X PUT /api/v1/car-bonus/assignments/update/550e8400-e29b-41d4-a716-446655440000 \
--form 'car.brandId="1"' \
--form 'car.modelId="1"' \
--form 'car.color="Azul"' \
--form 'car.image=@car_updated.jpg' \
--form 'assignment.quotationId="uuid"' \
--form 'assignment.price="15990"' \
--form 'assignment.interestRate="14.99"' \
--form 'assignment.initialInstallmentsCount="3"' \
--form 'assignment.monthlyInstallmentsCount="48"' \
--form 'assignment.paymentStartDate="2025-11-15"'
```

**Parámetros de ruta requeridos:**
- `id` (UUID) - ID de la asignación a actualizar

**Parámetros requeridos (form-data):**
- `car.brandId` (Long) - ID de la marca del vehículo
- `car.modelId` (Long) - ID del modelo del vehículo
- `car.color` (String) - Color del vehículo
- `assignment.price` (BigDecimal) - Precio del vehículo
- `assignment.interestRate` (BigDecimal) - Tasa de interés
- `assignment.initialInstallmentsCount` (Integer) - Número de cuotas iniciales
- `assignment.monthlyInstallmentsCount` (Integer) - Número de cuotas mensuales
- `assignment.paymentStartDate` (Date) - Fecha de inicio de pagos

**Parámetros opcionales (form-data):**
- `car.image` (File) - Nueva imagen del vehículo (si no se envía, mantiene la anterior)
- `assignment.quotationId` (UUID) - ID de la cotización asociada

**Respuesta:**
```json
{
  "result": true,
  "data": "Car assignment updated successfully"
}
```

**Validaciones:**
- El ID debe ser un UUID válido y la asignación debe existir
- Todos los campos requeridos deben ser positivos y válidos
- `brandId` y `modelId` deben existir en el sistema
- `quotationId` si se proporciona debe ser un UUID válido y existir
- `paymentStartDate` debe tener día entre 1 y 28
- La asignación no debe estar asignada a un miembro
- Si se proporciona `quotationId`, debe tener una clasificación activa y bono de rango activo

**Reglas de negocio:**
- Solo se pueden actualizar asignaciones no asignadas
- Si se incluye `quotationId`, se actualizan automáticamente los cronogramas de pago iniciales
- Si no se incluye `quotationId`, solo se actualiza la asignación

**Errores:**
- 400: ID inválido o validación (campos requeridos, valores positivos)
- 404: Asignación, marca, modelo, cotización o clasificación no encontrada
- 409: Asignación ya está asignada a un miembro o conflicto de negocio durante la actualización
- 422: La proforma debe ser aceptada para poder crear la asignación
- 500: Error interno

---

#### DELETE - Eliminar asignación de auto
```bash
curl -X DELETE /api/v1/car-bonus/assignments/delete/550e8400-e29b-41d4-a716-446655440000
```

**Parámetros de ruta requeridos:**
- `id` (UUID) - ID de la asignación a eliminar

**Respuesta:**
```json
{
  "result": true,
  "data": "Car deleted successfully"
}
```

**Reglas de negocio:**
- Solo se pueden eliminar asignaciones no asignadas
- Se elimina tanto la asignación como el vehículo asociado

**Errores:**
- 400: ID inválido (formato UUID incorrecto)
- 404: Asignación no encontrada
- 409: Asignación ya está asignada a un miembro (no se puede eliminar)
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
        "rewardedRankName": "Esmeralda",
        "currentRankName": "DOBLE DIAMANTE",
        "totalGpsUsd": 0.00,
        "totalInsuranceUsd": 658.05,
        "totalMandatoryInsuranceAmount": 0.00,
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

### Document Types API

#### GET - Listar tipos de documento
```bash
curl -X GET /api/v1/car-bonus/document-types
```

**Respuesta:**
```json
{
  "result": true,
  "data": [
    {"id": 1, "name": "Cédula de Ciudadanía"}
  ]
}
```

#### GET - Obtener tipo de documento por ID
```bash
curl -X GET /api/v1/car-bonus/document-types/1
```

**Respuesta:**
```json
{
  "result": true,
  "data": {"id": 1, "name": "Cédula de Ciudadanía"}
}
```

#### GET - Buscar tipos de documento por nombre
```bash
curl -X GET "/api/v1/car-bonus/document-types/search?name=cedula"
```

**Respuesta:**
```json
{
  "result": true,
  "data": [
    {"id": 1, "name": "Cédula de Ciudadanía"}
  ]
}
```

#### POST - Crear tipo de documento
```bash
curl -X POST /api/v1/car-bonus/document-types \
  -H "Content-Type: application/json" \
  -d '{"name": "Pasaporte"}'
```

**Respuesta:**
```json
{
  "result": true,
  "data": {"id": 2, "name": "Pasaporte"}
}
```

#### PUT - Actualizar tipo de documento
```bash
curl -X PUT /api/v1/car-bonus/document-types/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Cédula de Ciudadanía Actualizada"}'
```

**Respuesta:**
```json
{
  "result": true,
  "data": {"id": 1, "name": "Cédula de Ciudadanía Actualizada"}
}
```

#### DELETE - Eliminar tipo de documento
```bash
curl -X DELETE /api/v1/car-bonus/document-types/1
```

**Respuesta:**
```json
{
  "result": true,
  "data": "Document type deleted successfully"
}
```

### Car Assignment Documents API

Sistema de gestión de documentos asociados a asignaciones de autos. Permite crear, actualizar, eliminar y consultar documentos adjuntos a las asignaciones de vehículos.

#### POST - Crear documento de asignación
```bash
curl -X POST /api/v1/car-bonus/assignment-documents \
--form 'carAssignmentId="550e8400-e29b-41d4-a716-446655440000"' \
--form 'documentTypeId="1"' \
--form 'documentFile=@document.pdf'
```

**Parámetros requeridos (form-data):**
- `carAssignmentId` (UUID) - ID de la asignación del auto
- `documentTypeId` (Long) - ID del tipo de documento
- `documentFile` (File) - Archivo del documento (PDF u otros formatos soportados)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "carAssignmentId": "550e8400-e29b-41d4-a716-446655440000",
    "documentTypeId": 1,
    "fileName": "document.pdf",
    "fileUrl": "https://...",
    "fileSizeBytes": 1024000,
    "createdAt": "2025-10-16T10:00:00.000-05:00",
    "updatedAt": "2025-10-16T10:00:00.000-05:00"
  },
  "timestamp": "2025-10-16T10:00:00.000-05:00",
  "status": 201
}
```

**Validaciones:**
- Todos los campos son requeridos
- `carAssignmentId` debe ser un UUID válido y existir
- `documentTypeId` debe existir en el sistema
- `documentFile` debe ser un archivo válido

**Errores:**
- 400: Validación (campos requeridos faltantes, formato inválido)
- 404: Asignación o tipo de documento no encontrado
- 500: Error interno

---

#### PUT - Actualizar documento de asignación
```bash
curl -X PUT /api/v1/car-bonus/assignment-documents/550e8400-e29b-41d4-a716-446655440001 \
--form 'carAssignmentId="550e8400-e29b-41d4-a716-446655440000"' \
--form 'documentTypeId="1"' \
--form 'documentFile=@updated_document.pdf'
```

**Parámetros de ruta requeridos:**
- `id` (UUID) - ID del documento a actualizar

**Parámetros requeridos (form-data):**
- `carAssignmentId` (UUID) - ID de la asignación del auto
- `documentTypeId` (Long) - ID del tipo de documento

**Parámetros opcionales (form-data):**
- `documentFile` (File) - Nuevo archivo del documento (si no se envía, mantiene el anterior)

**Nota:** A diferencia del CREATE, el archivo es opcional en el UPDATE. Si no se proporciona, se mantiene el archivo anterior.

---

#### DELETE - Eliminar documento de asignación
```bash
curl -X DELETE /api/v1/car-bonus/assignment-documents/550e8400-e29b-41d4-a716-446655440001
```

**Parámetros de ruta requeridos:**
- `id` (UUID) - ID del documento a eliminar

**Respuesta:**
```json
{
  "result": true,
  "data": "Document deleted successfully",
  "timestamp": "2025-10-16T11:00:00.000-05:00",
  "status": 200
}
```

**Validaciones:**
- El ID debe ser un UUID válido y el documento debe existir

**Errores:**
- 400: ID inválido
- 404: Documento no encontrado
- 500: Error interno

---

#### GET - Buscar documentos de asignación (paginado y filtrado)
```bash
curl -X GET "/api/v1/car-bonus/assignment-documents/details?member=juan&rankId=5&documentCount=2&page=0&size=20"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `rankId` (Long) - Filtrar por ID de rango
- `documentCount` (Integer) - Filtrar por cantidad de documentos
- `page` (Integer) - Página (default: 0)
- `size` (Integer) - Tamaño de página (default: 20)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "content": [
      {
        "carAssignmentId": "550e8400-e29b-41d4-a716-446655440000",
        "memberId": 123,
        "username": "jperez",
        "memberName": "Juan Pérez",
        "car": "Toyota Corolla - Blanco",
        "rankId": 5,
        "rankName": "Embajador",
        "updatedAt": "2025-10-16 10:00:00",
        "documentCount": 2
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
    "sortBy": "updatedAt",
    "sortDirection": "DESC"
  },
  "timestamp": "2025-10-16T12:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: Parámetros inválidos (formato, page/size negativos)
- 404: No se encontraron documentos
- 500: Error interno

---

#### GET - Obtener detalles de documentos por asignación
```bash
curl -X GET "/api/v1/car-bonus/assignment-documents/details/550e8400-e29b-41d4-a716-446655440000"
```

**Parámetros de ruta requeridos:**
- `carAssignmentId` (UUID) - ID de la asignación del auto

**Respuesta:**
```json
{
  "result": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "carAssignmentId": "550e8400-e29b-41d4-a716-446655440000",
      "documentType": {
        "id": 1,
        "name": "Contrato"
      },
      "fileName": "contrato.pdf",
      "fileUrl": "https://...",
      "fileSizeBytes": "1024000",
      "createdAt": "2025-10-16T10:00:00.000-05:00",
      "updatedAt": "2025-10-16T10:00:00.000-05:00"
    }
  ],
  "timestamp": "2025-10-16T12:30:00.000-05:00",
  "status": 200
}
```

**Validaciones:**
- `carAssignmentId` debe ser un UUID válido

**Errores:**
- 400: ID de asignación inválido
- 404: Asignación no encontrada o sin documentos
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
    "monthlyBonus": 2500.00,
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
    "monthlyBonus": 3000.00,
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

#### GET - Obtener bono activo por ID de proforma
```bash
curl -X GET /api/v1/car-bonus/rank-bonuses/member/{quotationId}
```

**Descripción:** 
Endpoint para el frontend que permite obtener el bono de rango activo asociado a una proforma específica. Útil para autocompletar formularios con los datos del bono según la proforma seleccionada.

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "id": "e00e1fe0-8a31-49aa-8577-c5938cc6a8e2",
    "rankId": 12,
    "monthlyBonus": 2500.00,
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
1. Busca la cotización por ID y valida que esté aceptada
2. Obtiene la clasificación asociada a la cotización
3. Busca el rango de la clasificación
4. Busca el CarRankBonus activo para ese rango
5. Retorna todos los datos del bono para uso en formularios

**Casos de uso:**
- Autocompletar formularios de creación de asignaciones de autos y/o cronogramas

**Errores:**
- 400: ID de cotización inválido
- 404: Cotización no encontrada, clasificación no encontrada, rango no encontrado o no tiene bono activo asignado
- 422: Cotización no aceptada
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
        "monthlyBonus": 2500.00,
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
                "monthlyBonus": 2500.00,
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
                "monthlyBonus": 2500.00,
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
  /api/v1/car-bonus/schedules/installments/{carAssignmentId} \
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

---

#### GET - Exportar cronogramas de pago a Excel
```bash
curl -X GET "/api/v1/car-bonus/schedules/export/{carAssignmentId}"
```

**Parámetros de ruta requeridos:**
- `carAssignmentId` (UUID) - ID de la asignación del auto

**Contenido del Excel:**
El archivo contiene las siguientes columnas:
- Concepto
- Valor de cuota de financiamiento neto
- Seguro y Soat (USD)
- Inicial Fraccionada (USD)
- Bono Inicial (USD)
- GPS (USD)
- Bono Mensual (USD)
- Pago asumido por el socio (USD)
- Total (USD)
- Fecha de vencimiento
- Estado
- Fecha de pago

**Errores:**
- 400: carAssignmentId inválido (formato UUID incorrecto)
- 404: No se encontraron cronogramas de pago para exportar
- 500: Error interno

---

#### GET - Buscar cronogramas de pago (paginado)
```bash
curl -X GET "/api/v1/car-bonus/schedules/search/{carAssignmentId}?page=0&size=20"
```

**Parámetros de ruta requeridos:**
- `carAssignmentId` (UUID) - ID de la asignación del auto

**Parámetros de consulta opcionales:**
- `numberOfInstallments` (Integer) - Número de cuotas
- `statusCode` (String) - Código de estado (PENDING, PAID, ...)
- `page` (Integer) - Página (default: 0)
- `size` (Integer) - Tamaño de página (default: 20)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "carAssignmentId": "uuid",
        "orderNum": 1,
        "installmentNum": 1,
        "isInitial": false,
        "financingInstallment": 1500.00,
        "insurance": 200.00,
        "initialInstallment": 0.00,
        "initialBonus": 0.00,
        "gps": 100.00,
        "monthlyBonus": 250.00,
        "memberAssumedPayment": 1550.00,
        "total": 1550.00,
        "dueDate": "2025-11-01",
        "status": {
          "id": 1,
          "name": "PENDING"
        },
        "paymentDate": null
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
    "sortBy": "orderNum",
    "sortDirection": "ASC"
  },
  "timestamp": "2025-10-15T00:00:00.000-05:00",
  "status": 200
}
```

**Casos de uso:**
- Consultar todas las cuotas de pago de una asignación de auto
- Generar reportes de cronogramas de pago

**Errores:**
- 400: Parámetros inválidos (carAssignmentId no UUID, page/size negativos)
- 404: No se encontraron cronogramas de pago para la asignación
- 500: Error interno

---

#### GET - Buscar cronogramas iniciales de pago (paginado)
```bash
curl -X GET "/api/v1/car-bonus/schedules/initials/{carAssignmentId}?page=0&size=20"
```

**Parámetros de ruta requeridos:**
- `carAssignmentId` (UUID) - ID de la asignación del auto

**Parámetros de consulta opcionales:**
- `page` (Integer) - Página (default: 0)
- `size` (Integer) - Tamaño de página (default: 20)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "carAssignmentId": "uuid",
        "orderNum": 1,
        "installmentNum": 1,
        "isInitial": true,
        "financingInstallment": 0.00,
        "insurance": 0.00,
        "initialInstallment": 2000.00,
        "initialBonus": 5000.00,
        "gps": 0.00,
        "monthlyBonus": 0.00,
        "memberAssumedPayment": 2000.00,
        "total": 7000.00,
        "dueDate": "2025-10-28",
        "status": {
          "id": 2,
          "name": "PAID"
        },
        "paymentDate": "2025-10-15 10:00:00"
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
    "sortBy": "orderNum",
    "sortDirection": "ASC"
  },
  "timestamp": "2025-10-15T00:00:00.000-05:00",
  "status": 200
}
```

**Casos de uso:**
- Consultar solo las cuotas iniciales de una asignación

**Errores:**
- 400: Parámetros inválidos (carAssignmentId no UUID, page/size negativos)
- 404: No se encontraron cronogramas iniciales para la asignación
- 500: Error interno

---

#### GET - Obtener información extra del cronograma de pagos
```bash
curl -X GET "/api/v1/car-bonus/schedules/extra-info/{carAssignmentId}"
```

**Parámetros de ruta requeridos:**
- `carAssignmentId` (UUID) - ID de la asignación del auto

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "memberId": 123,
    "username": "jperez",
    "memberFullName": "Juan Pérez",
    "memberRankId": 5,
    "memberRankName": "Embajador",
    "eventId": 456,
    "eventName": "Evento Especial 2025",
    "carBrand": "Toyota",
    "carModel": "Corolla",
    "coveredInitialUsd": 5000.00,
    "carPriceUsd": 14990.00,
    "monthlyBonusUsd": 250.00,
    "totalInitialInstallments": 2,
    "paidInitialInstallments": 2,
    "totalPaidInitialUsd": 7000.00,
    "totalMonthlyInstallments": 60,
    "paidMonthlyInstallments": 10,
    "totalPaidMonthlyUsd": 15500.00,
    "remainingInitialInstallments": 0,
    "remainingInitialInstallmentsUsd": 0.00,
    "remainingMonthlyInstallments": 50,
    "remainingMonthlyInstallmentsUsd": 77500.00,
    "totalInitialInstallmentsUsd": 7000.00,
    "totalMonthlyInstallmentsUsd": 93000.00,
    "initialPaymentDate": "2025-10-28",
    "lastPaymentDate": "2027-09-28",
    "interestRate": 13.99
  },
  "timestamp": "2025-10-22T00:00:00.000-05:00",
  "status": 200
}
```

**Descripción de campos:**
- `memberId`: ID del socio asignado al vehículo
- `username`: Nombre de usuario del socio
- `memberFullName`: Nombre completo del socio
- `memberRankId`: ID del rango del socio
- `memberRankName`: Nombre del rango del socio
- `eventId`: ID del evento
- `eventName`: Nombre del evento
- `carBrand`: Marca del vehículo
- `carModel`: Modelo del vehículo
- `coveredInitialUsd`: Bono inicial cubierto por la empresa
- `carPriceUsd`: Precio total del vehículo en USD
- `monthlyBonusUsd`: Bono mensual asignado
- `totalInitialInstallments`: Número total de cuotas iniciales
- `paidInitialInstallments`: Número de cuotas iniciales pagadas
- `totalPaidInitialUsd`: Total pagado en cuotas iniciales
- `totalMonthlyInstallments`: Número total de cuotas mensuales
- `paidMonthlyInstallments`: Número de cuotas mensuales pagadas
- `totalPaidMonthlyUsd`: Total pagado en cuotas mensuales
- `remainingInitialInstallments`: Cuotas iniciales restantes por pagar
- `remainingInitialInstallmentsUsd`: Monto restante en cuotas iniciales
- `remainingMonthlyInstallments`: Cuotas mensuales restantes por pagar
- `remainingMonthlyInstallmentsUsd`: Monto restante en cuotas mensuales
- `totalInitialInstallmentsUsd`: Total de todas las cuotas iniciales
- `totalMonthlyInstallmentsUsd`: Total de todas las cuotas mensuales
- `initialPaymentDate`: Fecha del primer pago
- `lastPaymentDate`: Fecha del último pago
- `interestRate`: Tasa de interés del financiamiento

**Casos de uso:**
- Obtener resumen completo de una asignación de vehículo con toda la información relevante
- Generar reportes detallados de asignaciones
- Mostrar información consolidada en interfaces de usuario

**Validaciones:**
- `carAssignmentId` debe ser un UUID válido y existir en el sistema

**Errores:**
- 400: carAssignmentId inválido (formato UUID incorrecto)
- 404: Asignación no encontrada o sin cotización encontrada
- 500: Error interno

### Car Bonus Application Details API

Sistema de consulta de detalles de aplicaciones de bonos de autos. Permite buscar y exportar detalles de aplicaciones de bonos con filtros y paginación.

#### GET - Buscar detalles de aplicaciones de bonos (paginado y filtrado)

```bash
curl -X GET "/api/v1/car-bonus/bonus-applications/details?member=juan&appliedDate=2025-10-22&bonusAmount=1000&onlyInitial=true&page=0&size=20"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `appliedDate` (Date) - Fecha de aplicación (YYYY-MM-DD)
- `bonusAmount` (BigDecimal) - Monto del bono
- `onlyInitial` (Boolean) - Solo bonos iniciales (default: false)
- `page` (Integer) - Página (default: 0)
- `size` (Integer) - Tamaño de página (default: 20)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "content": [
      {
        "bonusApplicationId": "uuid",
        "carAssignmentId": "uuid",
        "memberId": 123,
        "username": "jperez",
        "memberFullName": "Juan Pérez",
        "bonusAmount": 5000.00,
        "discountAmount": 100.00,
        "description": "Descuento por bono inicial",
        "paymentTypeId": 1,
        "paymentTypeCode": "CASH",
        "isInitial": true,
        "appliedDate": "2025-10-22"
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
    "sortBy": "bonus_application_id",
    "sortDirection": "DESC"
  },
  "timestamp": "2025-10-22T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: Parámetros inválidos (formato, page/size negativos)
- 404: No se encontraron aplicaciones de bonos
- 500: Error interno

---

#### GET - Exportar detalles de aplicaciones de bonos a Excel

```bash
curl -X GET "/api/v1/car-bonus/bonus-applications/details/export?member=juan&appliedDate=2025-10-22&bonusAmount=1000&onlyInitial=true"
```

**Parámetros opcionales:**
- `member` (String) - Filtrar por nombre o usuario del socio
- `appliedDate` (Date) - Fecha de aplicación (YYYY-MM-DD)
- `bonusAmount` (BigDecimal) - Monto del bono
- `onlyInitial` (Boolean) - Solo bonos iniciales (default: false)

**Respuesta:** Archivo Excel descargable con encabezados apropiados.

**Contenido del Excel:**
- Username
- Nombre Completo
- Monto de Recarga (USD)
- Monto de Descuento (USD)
- Concepto de Descuento
- Medio de Pago
- Fecha de Descuento

**Errores:**
- 400: Parámetros inválidos
- 404: No se encontraron aplicaciones de bonos para exportar
- 500: Error interno

### Notifications API

#### POST - Crear notificaciones
```bash
curl -X POST /api/v1/notifications \
  -H "Content-Type: application/json" \
  -d '[
    {
        "memberId": 1,
        "typeId": 2,
        "title": "Título",
        "message": "Mensaje"
    }
  ]'
```

**Cuerpo:** Objeto NotificationRequest
- `memberId` (Long, requerido)
- `typeId` (Long, requerido)
- `title` (String, requerido)
- `message` (String, requerido)

**Respuesta:**
```json
{
  "result": true,
  "data": [
    {
      "id": "fae21e53-eb17-4792-8776-d4e440cc9dd6",
      "memberId": 1,
      "typeId": 2,
      "title": "Título",
      "message": "Mensaje",
      "isRead": false,
      "createdAt": "2025-10-20 10:42:56",
      "readAt": null
    }
  ],
  "timestamp": "2025-10-20T00:00:00.000-05:00",
  "status": 201
}
```

**Errores:**
- 400: Datos inválidos
- 500: Error interno

---

#### GET - Obtener notificaciones más recientes
```bash
curl -X GET "/api/v1/notifications/latest?memberId=1&limit=5"
```

**Parámetros requeridos:**
- `memberId` (Long)
- `limit` (Integer, default: 1)

**Respuesta:**
```json
{
  "result": true,
  "data": [
    {
      "id": "uuid",
      "memberId": 1,
      "typeId": 2,
      "title": "Título",
      "message": "Mensaje",
      "isRead": false,
      "createdAt": "2025-10-20T00:00:00.000-05:00",
      "readAt": null
    }
  ],
  "timestamp": "2025-10-20T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: Parámetros inválidos
- 404: No se encontraron notificaciones
- 500: Error interno

---

#### PUT - Marcar notificación como leída
```bash
curl -X PUT /api/v1/notifications/mark-as-read/{notificationId}
```

**Parámetros de ruta:**
- `notificationId` (UUID)

**Respuesta:**
```json
{
  "result": true,
  "data": {
    "id": "uuid",
    "memberId": 1,
    "typeId": 2,
    "title": "Título",
    "message": "Mensaje",
    "isRead": true,
    "createdAt": "2025-10-20T00:00:00.000-05:00",
    "readAt": "2025-10-20T01:00:00.000-05:00"
  },
  "timestamp": "2025-10-20T00:00:00.000-05:00",
  "status": 200
}
```

**Errores:**
- 400: UUID inválido
- 404: Notificación no encontrada
- 500: Error interno

---