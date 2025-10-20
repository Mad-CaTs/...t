<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Codigo de Transferencia - InClub</title>
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
        h2 {
            font-size: 18px;
            color: #333;
            margin: 10px 0;
            line-height: 1.5;
        }
        h3 {
            font-size: 16px;
            color: #555;
            margin: 10px 0;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin: 15px 0;
        }
        .code {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 20px;
            font-weight: bold;
            color: #0d80ea;
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
        <h1>Hola, ${nombreCompleto}</h1>
        <h3>Estas a punto de realizar una transferencia a ${sponsorNombreCompleto}</h3>
        <p>Utiliza el siguiente codigo para confirmar tu transferencia:</p>
        <div class="code">${token}</div>
        <h2>Este codigo es valido por 15 minutos</h2>
        <p><strong>Importante:</strong> No compartas este codigo con nadie.</p>
        <div class="divider"></div>
    </div>
    <div class="footer">
        <p>InClub - Todos los derechos reservados</p>
        <p>Si tienes alguna duda, contactanos en soporte@inclub.com</p>
    </div>
</div>
</body>
</html>