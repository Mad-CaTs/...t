<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head><title>Listado de Productos</title></head>
<body>
<h2>Listado de Productos</h2>
<table border="1">
    <tr>
        <th>ID</th>
        <th>Marca</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th>Categoría</th>
    </tr>

    <c:forEach var="prod" items="${productos}">
        <tr>
            <td>${prod.id}</td>
            <td>${prod.marca}</td>
            <td>S/. ${prod.precio}</td>
            <td>${prod.cantidad}</td>
            <td>${prod.categoriaNombre}</td>
        </tr>
    </c:forEach>
</table>
</body>
</html>
