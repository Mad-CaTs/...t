<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalles de transferencia - InClub</title>
    <style>
    :root { --bg: #f1f5f8; --card-bg: #ffffff; --muted: #667085; --text: #0f1720; --subtext: #475569; --accent-start: #00a9e0; --accent-end: #ff8a00; --soft: #f9fafb; --border: #eef2f7; }
    body { margin:0; padding:0; background-color:var(--bg); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .email-wrapper { width:100%; background:var(--bg); padding:40px 0; }
    .email-container { width:100%; max-width:680px; margin:0 auto; }
    .card { background:var(--card-bg); border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(17,24,39,0.06); }
    .header { background: linear-gradient(90deg, var(--accent-start) 0%, var(--accent-end) 100%); padding:28px 32px; text-align:center; }
    .logo { width:220px; max-width:80%; height:auto; margin:0 auto; }
    .body { padding:28px 40px; color:var(--text); }
    .greeting { font-size:18px; color:var(--text); margin:0 0 8px 0; font-weight:700; }
    .intro { font-size:15px; color:var(--subtext); margin:0 0 16px 0; }
    .details { background:var(--soft); border-radius:8px; padding:18px; margin:16px 0; }
    .details-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
    .details-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(15,23,36,0.04); }
    .details-row:last-child { border-bottom:none; }
    .label { font-size:13px; color:var(--muted); }
    .value { font-size:14px; font-weight:600; color:var(--text); }
    .channels-wrap { text-align:center; margin-top:6px; }
    .channels { display:inline-flex; justify-content:center; gap:28px; }
    .channel { display:inline-block; text-align:center; font-size:13px; color:#2563eb; text-decoration:none; }
    .help-block { background:var(--card-bg); padding:20px 24px; border-radius:8px; margin-top:18px; border:1px solid var(--border); }
    .help-title { margin:0 0 6px 0; color:var(--text); font-weight:700; }
    .help-text { margin:0; font-size:14px; color:var(--subtext); }
    .notice { font-size:12px; color:#94a3b8; margin-top:18px; }
    .footer { padding:20px 28px; text-align:center; font-size:13px; color:#94a3b8; }
    a.unsubscribe { color:#6b7280; text-decoration:underline; }
    </style>
</head>
<body>
<div class="email-wrapper">
    <div class="email-container">
        <div class="card">
            <div class="header" role="img" aria-label="InClub header">
                <img class="logo" src="https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/Keola_correo.jpeg" alt="InClub">
            </div>
            <div class="body">
                <p class="greeting">Estimado/a ${clienteNombre?html}</p>
                <p class="intro">A continuación los detalles de la transferencia:</p>
                <div class="details">
                    <div class="details-top">
                        <div class="label">Tipo</div>
                        <div class="label">${transfer_type_label?if_exists?html}</div>
                    </div>
                    <#if transaction?has_content>
                        <#list transaction as t>
                            <div class="details-row">
                                <div>
                                    <div class="label">Concepto</div>
                                    <div class="value">${t.concept?html}</div>
                                </div>
                                <div class="right-col">
                                    <div class="label">Monto</div>
                                    <div class="value">${t.amount?html}</div>
                                </div>
                            </div>
                        </#list>
                    </#if>
                </div>
                <div class="help-block">
                    <h4 class="help-title">Contacto</h4>
                <#assign assetsBase = (assetsBaseUrl?if_exists)!"/assets/transfer"> 
                <#include "transfer_helpers.ftl">
                </div>
                <p class="notice">Si prefiere no recibir este tipo de correo electrónico, <a class="unsubscribe" href="#">Dar de baja</a></p>
            </div>
        </div>
    <div class="footer">
        Valle Encantado S.A.C, Perú.<br>
        &copy;2025 Inclub
    </div>
    </div>
</div>
</body>
</html>
