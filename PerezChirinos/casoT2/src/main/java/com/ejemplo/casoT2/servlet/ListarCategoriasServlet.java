package com.ejemplo.casoT2.servlet;

import com.ejemplo.casoT2.ConexionDB;
import com.ejemplo.casoT2.model.Categoria;
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

@WebServlet("/categorias")
public class ListarCategoriasServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        List<Categoria> categorias = new ArrayList<>();

        try (Connection conn = ConexionDB.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM Categoria")) {

            while (rs.next()) {
                Categoria c = new Categoria();
                c.setId(rs.getInt("id"));
                c.setNombre(rs.getString("nombre"));
                c.setDescripcion(rs.getString("descripcion"));
                categorias.add(c);
            }
        } catch (SQLException e) {
            throw new ServletException("Error al listar categorías", e);
        }

        request.setAttribute("categorias", categorias);
        request.getRequestDispatcher("categorias.jsp").forward(request, response);
    }
}
