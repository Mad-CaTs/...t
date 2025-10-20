<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validacion Aceptada - InClub</title>
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
        .info {
            text-align: left;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .info p {
            margin: 10px 0;
        }
        .highlight {
            color: #0d80ea;
            font-weight: bold;
        }
        .button {
            display: inline-block;
            background: #0d80ea;
            color: #ffffff; /* Text color changed to white for better contrast */
            font-weight: bold;
            font-size: 16px;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin: 20px 0;
            transition: background 0.3s;
        }
        .button:hover {
            background: #005bb5;
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
        <img src="https://imgtr.ee/images/2024/09/06/74189e5e9c30cdd776b17577de2ff1e6.png" alt="InClub Banner">
    </div>
    <div class="content">
        <h1>Validacion Aceptada</h1>
        <p>¡Felicidades! Tu solicitud de exoneracion ha sido aceptada.</p>
        <div class="info">
            <p><strong>Fecha de exoneracion:</strong> <span class="highlight">${date}</span></p>
            <p><strong>Numero de operacion:</strong> <span class="highlight">${operationNumber}</span></p>
            <p><strong>Monto a percibir:</strong> <span class="highlight">${amountPaid}</span></p>
        </div>
        <a href="https://www.inclub.world/backoffice/home" class="button">Ir a InClub.com</a>
        <div class="divider"></div>
        <p>Gracias por ser parte de InClub. Si necesitas mas informacion, estamos aqui para ayudarte.</p>
    </div>
    <div class="footer">
        <p>InClub - Todos los derechos reservados</p>
        <p>Si tienes alguna duda, contactanos en soporte@inclub.com</p>
    </div>
</div>
</body>
</html>