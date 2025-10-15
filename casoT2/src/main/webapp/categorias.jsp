<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Categorías</title>
</head>
<body>
    <h2>Listado de Categorías</h2>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
        </tr>
        <c:forEach var="cat" items="${categorias}">
            <tr>
                <td>${cat.id}</td>
                <td>${cat.nombre}</td>
                <td>${cat.descripcion}</td>
            </tr>
        </c:forEach>
    </table>
    <br><a href="productos">Ver Productos</a>
</body>
</html>