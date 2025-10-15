package com.ejemplo.casoT2.servlet;

import com.ejemplo.casoT2.ConexionDB;
import com.ejemplo.casoT2.model.Producto;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/productos")
public class ListarProductosServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        List<Producto> productos = new ArrayList<>();
        String sql = "SELECT p.id, p.marca, p.precio, p.cantidad, c.nombre AS categoriaNombre " +
                "FROM Producto p " +
                "LEFT JOIN Categoria c ON p.categoria_id = c.id";

        try (Connection conn = ConexionDB.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Producto p = new Producto();
                p.setId(rs.getInt("id"));
                p.setMarca(rs.getString("marca"));
                p.setPrecio(rs.getDouble("precio"));
                p.setCantidad(rs.getInt("cantidad"));
                p.setCategoriaNombre(rs.getString("categoriaNombre"));
                productos.add(p);
            }
        } catch (SQLException e) {
            throw new ServletException("Error al listar productos", e);
        }

        request.setAttribute("productos", productos);
        request.getRequestDispatcher("productos.jsp").forward(request, response);
    }
}