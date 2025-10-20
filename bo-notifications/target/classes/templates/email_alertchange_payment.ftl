<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correccion de Metodo de Pago - InClub</title>
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
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin: 15px 0;
        }
        table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
            background: #f9f9f9;
            border-radius: 8px;
            overflow: hidden;
        }
        th, td {
            padding: 12px;
            text-align: center;
            font-size: 16px;
            border: 1px solid #e0e0e0;
        }
        th {
            background: #0d80ea;
            color: #ffffff;
            font-weight: bold;
        }
        td {
            color: #333;
        }
        .button {
            display: inline-block;
            background: #0d80ea;
            color: #ffffff;
            font-weight: bold;
            font-size: 16px;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin: 20px 0;
            transition: background 0.3s;
            text-align: center;
        }
        .button:hover {
            background: #005bb5;
        }
        .button span {
            color: #ffffff;
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
        <p>Te informamos que el voucher con codigo de operacion: ${operationNumber} tenia un error en el metodo de pago.</p>
        <p>Por excepcion y por unica vez, el error ha sido corregido por el sistema.</p>
        <h2>Por favor, verifica que el medio de pago sea correcto en tus proximos pagos, ya que de no serlo, el pago sera rechazado.</h2>
        <table>
            <tr>
                <th>Metodo de pago anterior</th>
                <th>Metodo de pago corregido</th>
            </tr>
            <tr>
                <td>${paymentTypeOld} ${paymentSubTypeOld}</td>
                <td>${paymentTypeNew} ${paymentSubTypeNew}</td>
            </tr>
        </table>
        <a href="${linklogin}" class="button"><span>Ir a InClub</span></a>
        <div class="divider"></div>
        <p>¡Gracias por tu atencion!</p>
    </div>
    <div class="footer">
        <p>InClub - Todos los derechos reservados</p>
        <p>Si tienes alguna duda, contactanos en soporte@inclub.com</p>
    </div>
</div>
</body>
</html>