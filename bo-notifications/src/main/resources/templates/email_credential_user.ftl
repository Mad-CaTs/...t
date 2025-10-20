<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a InClub</title>
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
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin: 15px 0;
        }
        .credentials {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            font-weight: bold;
            font-size: 16px;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin: 10px;
            transition: background 0.3s;
        }
        .button span {
            color: #ffffff;
        }
        .telegram-button {
            background: #33D7FF;
            color: #ffffff;
        }
        .telegram-button:hover {
            background: #26a8cc;
        }
        .whatsapp-button {
            background: #33FF42;
            color: #ffffff;
        }
        .whatsapp-button:hover {
            background: #26cc34;
        }
        .inclub-button {
            background: #0d80ea;
            color: #ffffff;
        }
        .inclub-button:hover {
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
        <img src="https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/fondo.png" alt="InClub Banner">
    </div>
    <div class="content">
        <h1>Bienvenido, ${nombreCompleto}</h1>
        <h2>¡Ya formas parte de la familia InClub!</h2>
        <p><strong>Producto adquirido:</strong> ${packageName}</p>
        <p><strong>Descripción:</strong> ${packageDescription}</p>
        <p>Ingresa a nuestro portal con las siguientes credenciales:</p>
        <div class="credentials">
            <h2>Usuario: ${userName}</h2>
            <h2>Contraseña: ${userName}</h2>
        </div>
        <p>Únete a nuestros grupos para estar al tanto de todas las novedades:</p>
        <a href="${telegramLink}" class="button telegram-button"><span>Unirse a Telegram</span></a>
        <a href="${whatsappLink}" class="button whatsapp-button"><span>Unirse a WhatsApp</span></a>
        <a href="${linklogin}" class="button inclub-button"><span>Ir a InClub.com</span></a>
        <div class="divider"></div>
        <p><strong>Patrocinador:</strong> ${sponsorNombreCompleto}</p>
        <p>Recuerda que puedes realizar tus pagos mediante depósito en nuestra cuenta corriente a través de Agente BCP, Agencia BCP o transferencia bancaria desde Banca por Internet.</p>
    </div>
    <div class="footer">
        <p>InClub - Todos los derechos reservados</p>
        <p>Si tienes alguna duda, contáctanos en soporte@inclub.com</p>
    </div>
</div>
</body>
</html>