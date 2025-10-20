<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentos - InClub</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #0d80ea, #4facfe);
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-width: 100%;
            height: auto;
            border-bottom: 4px solid #ffffff;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        h1 {
            font-size: 28px;
            font-weight: bold;
            color: #0d80ea;
            margin: 10px 0;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin: 15px 0;
        }
        table {
            width: 90%;
            margin: 20px auto;
            border-collapse: collapse;
            font-size: 16px;
        }
        th, td {
            padding: 12px;
            border: 1px solid #e0e0e0;
            text-align: left;
        }
        th {
            background: #0d80ea;
            color: #ffffff;
            font-weight: bold;
        }
        td {
            background: #f9f9f9;
            color: #333;
        }
        td a {
            color: #0d80ea;
            text-decoration: none;
            font-weight: bold;
        }
        td a:hover {
            text-decoration: underline;
        }
        .divider {
            margin: 20px 0;
            border-top: 1px solid #e0e0e0;
        }
        .footer {
            background: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <img src="https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/fondo.png" alt="InClub Banner">
    </div>
    <div class="content">
        <h1>Gracias por unirte, ${nombreCompleto}</h1>
        <p>Bienvenido a la familia InClub! A continuacion, encontraras los enlaces a tus documentos importantes:</p>
        <table>
            <tr>
                <th>Documento</th>
                <th>Enlace</th>
            </tr>
            <#list ["Contrato", "Cronograma de Pagos", "Plan de Beneficios", "Codigo de Etica", "Beneficios Adicionales", "Certificado", "Contrato de RCI", "Pagare"] as attr>
                <#if (document[attr])?has_content>
                    <tr>
                        <td>${attr}</td>
                        <td><a href="${document[attr]}" target="_blank">Descargar</a></td>
                    </tr>
                </#if>
            </#list>
        </table>
        <div class="divider"></div>
        <p>Si necesitas ayuda con tus documentos, no dudes en contactarnos.</p>
    </div>
    <div class="footer">
        <p>InClub - Todos los derechos reservados</p>
        <p>Si tienes alguna duda, contactanos en soporte@inclub.com</p>
    </div>
</div>
</body>
</html>