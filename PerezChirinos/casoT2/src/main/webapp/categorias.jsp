<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Categorías</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        table {
            width: 80%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        h2 {
            color: #333;
        }
    </style>
</head>
<body>
    <h2>Listado de Categorías</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="cat" items="${categorias}">
                <tr>
                    <td>${cat.id}</td>
                    <td>${cat.nombre}</td>
                    <td>${cat.descripcion}</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>

    <c:if test="${empty categorias}">
        <p style="color: red; margin-top: 20px;">No hay categorías registradas.</p>
    </c:if>

    <br><br>
    <a href="${pageContext.request.contextPath}/productos">Ver Productos</a>
</body>
</html>