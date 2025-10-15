<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Listado de Productos</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        table {
            width: 90%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #2196F3;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #e0e0e0;
        }
        h2 {
            color: #333;
        }
        .precio {
            font-weight: bold;
            color: #4CAF50;
        }
    </style>
</head>
<body>
    <h2>Listado de Productos</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Categoría</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="prod" items="${productos}">
                <tr>
                    <td>${prod.id}</td>
                    <td>${prod.marca}</td>
                    <td class="precio">S/. ${prod.precio}</td>
                    <td>${prod.cantidad}</td>
                    <td>${prod.categoriaNombre}</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>

    <c:if test="${empty productos}">
        <p style="color: red; margin-top: 20px;">No hay productos registrados.</p>
    </c:if>

    <br><br>
    <a href="${pageContext.request.contextPath}/categorias">Ver Categorías</a>
</body>
</html>