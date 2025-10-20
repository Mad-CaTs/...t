<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transferencia rechazada - InClub</title>
  <style>
  :root {
    --bg:#f1f5f8;
    --card-bg:#fff;
    --muted:#667085;
    --text:#0f1720;
    --accent-start:#00a9e0;
    --accent-end:#ff8a00;
    --soft:#f9fafb;
    --border:#eef2f7;
  }

  body{margin:0;padding:0;background:var(--bg);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}
  .email-wrapper{width:100%;background:var(--bg);padding:40px 0}
  .email-container{max-width:680px;margin:0 auto}
  .card{background:var(--card-bg);border-radius:12px;overflow:hidden;box-shadow:0 8px 20px rgba(17,24,39,.06)}
  .header{background:linear-gradient(90deg,var(--accent-start) 0%,var(--accent-end) 100%);text-align:center}
  .logo{display:block;width:100%;max-height:180px;object-fit:cover}
  .body{padding:24px 28px;color:var(--text)}
  .greeting{font-size:18px;color:#4b0b5b;margin:0 0 8px;font-weight:700;text-align:center}
  .intro{font-size:14px;color:#525252;margin:6px 0 16px;line-height:1.45;text-align:center}

  /* === Bloque principal === */
  .help-block{
    background:#fff;
    border:1px solid #E6EBF2;
    border-radius:12px;
    padding:16px 18px;
    box-shadow:0 1px 0 rgba(16,24,40,.02);
    margin-top:16px;
  }
  .help-block .help-title{margin:0 0 6px;color:#ef4444;font-weight:700;font-size:13px}
  .help-block .help-value{margin:6px 0 8px;font-size:14px;color:#6b7280;font-weight:400;line-height:1.45}
  .help-block .help-value.bold{color:#111827;font-weight:700}
  .help-block .help-subtitle{margin-top:8px;color:#6b7280;font-size:13px}
  .help-block .help-solution{margin:10px 0 0;font-size:14px;color:#111827;font-weight:700}

  /* === Tarjeta de detalles === */
  .details{
    background:#fff;
    border:1px solid #E6EBF2;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 1px 0 rgba(16,24,40,.02);
    margin-top:16px;
  }
  .details-top{
    padding:16px 18px 12px 18px;
    border-bottom:1px solid #E6EBF2;
  }
  .type-title{font-size:15px;color:#2b0b38;font-weight:700;line-height:1.35;margin:0}
  .type-date{font-size:12px;color:#9ca3af;line-height:1.2;margin-top:4px}

  .sponsor-block{
    display:grid;
    grid-template-columns:220px 1fr;
    gap:16px;
    padding:12px 18px;
    border-bottom:1px solid #E6EBF2;
  }
  .sponsor-block .label{font-size:13px;color:#6b7280;font-weight:600;text-align:left;margin:0}
  .sponsor-block .value{font-size:14px;font-weight:700;color:#111827;text-align:right;margin:0}
  .sponsor-block .username{grid-column:2;font-size:12px;color:#9ca3af;margin-top:2px;text-align:right}

  .details-rows{background:#fff}
  .details-row{
    display:grid;
    grid-template-columns:220px 1fr;
    gap:16px;
    padding:12px 18px;
    border-bottom:1px solid #E6EBF2;
  }
  .details-row:last-child{border-bottom:none}
  .label{font-size:13px;color:var(--muted);font-weight:600}
  .value{font-size:14px;color:var(--text);font-weight:700;text-align:right}
  .value.small{font-size:12px;color:#9ca3af;font-weight:400;margin-top:2px;text-align:right}

  /* === Canales de atención === */
  .channels-wrap{
    background:#fff;
    border:1px solid #E6EBF2;
    border-radius:12px;
    padding:20px;
    box-shadow:0 1px 0 rgba(16,24,40,.02);
    text-align:center;
    margin-top:14px;
  }
  .channels-title{font-weight:700;color:#4b5960;margin:0 0 12px 0;font-size:14px}
  .channels{display:table;width:100%;table-layout:fixed}
  .channel{display:table-cell;text-align:center;vertical-align:top;padding:10px 0 6px;text-decoration:none;color:#2b50e0;font-size:13px}
  .channel span{display:block;font-size:22px;margin-bottom:8px}

  /* === Sección ayuda === */
  .help-block.support{
    background:#f9fafb;
    border:1px solid #e9eef5;
    border-radius:12px;
    padding:20px 22px;
    margin-top:18px;
  }
  .help-block.support .help-title{color:#111827;font-size:14px;margin:0 0 8px 0}
  .help-block.support .help-text{margin:0;font-size:14px;color:#525252;line-height:1.5}
  .help-block.support .help-text a{color:#2b50e0;text-decoration:underline}

  /* === Pie === */
  .notice{font-size:12px;color:#94a3b8;margin-top:18px;line-height:1.6;text-align:left}
  .notice a.unsubscribe{color:#2b50e0;text-decoration:underline;font-weight:500}
  .footer{padding:16px 28px 0;text-align:left;font-size:12px;color:#94a3b8;line-height:1.5}
  </style>
</head>
<body>
<div class="email-wrapper">
  <div class="email-container">
  <div class="card">
  <#include "transfer_helpers.ftl">
  <#-- assetsBase: prefer provided assetsBaseUrl, otherwise use builtin static path -->
  <#assign assetsBase = (assetsBaseUrl?if_exists)!"/assets/transfer"> 
      <div class="header" role="img" aria-label="InClub header">
        <img class="logo" src="https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/Keola_correo.jpeg" alt="InClub">
      </div>

      <div class="body">
        <#assign membership_value = (membershipToTransfer! (membresiaATraspasar! (membershipName! (packageName! ""))))>

        <p class="greeting">Estimado/a ${clienteNombre?html}</p>
        <p class="intro">Nos complace informarle que la solicitud de transferencia de cuenta a nuevo socio ha sido rechazada. A continuación, le detallamos la información:</p>

        <!-- BLOQUE RECHAZO -->
        <div class="help-block">
          <h4 class="help-title">Tipo de rechazo</h4>
          <#if (rejectionType?has_content)>
            <div class="help-value bold">${rejectionType?html}</div>
          <#elseif (rejectionReason?has_content)>
            <div class="help-value bold">${rejectionReason?html}</div>
          <#else>
            <div class="help-value">${detailRejectionTransfer?html}</div>
          </#if>
          <div class="help-subtitle">Mensaje adicional o solución alternativa</div>
          <div class="help-text">${(detailRejectionTransfer! "")?html}</div>
          <#if (rejectionSolution?has_content)>
            <div class="help-solution">${rejectionSolution?html}</div>
          </#if>
        </div>

        <!-- BLOQUE DETALLES -->
        <div class="details">
          <div class="details-top">
            <div class="type-title">${transfer_type_label?if_exists?html}</div>
            <div class="type-date">${fecha?if_exists?html}</div>
          </div>

          <div class="sponsor-block">
            <div class="label">Patrocinador:</div>
            <div class="value">${patrocinadorNombre?if_exists?html}</div>
            <div class="username">${sponsor_username?if_exists?html}</div>
          </div>

          <div class="details-rows">
            <#if patrocinadorDoc?has_content>
            <div class="details-row">
              <div class="label">Documento</div>
              <div class="value">${patrocinadorDoc?if_exists?html}</div>
            </div>
            </#if>

            <!-- Perfil a traspasar: show ONLY when username_child exists and is not a literal 'null'/'none'/'undefined' -->
            <#assign _u = (username_child?has_content)?then(username_child?string, "") />
            <#assign _u = _u?trim />
            <#assign _showPerfil = _u?has_content && (_u?lower_case != 'null') && (_u?lower_case != 'none') && (_u?lower_case != 'undefined') />
            <#if _showPerfil>
              <div class="details-row">
                <div class="label">Perfil a traspasar:</div>
                <div class="value">${_u?html}</div>
              </div>
            </#if>

            <#-- Normalize membership names and pick the first valid non-literal value -->
            <#assign _m1 = (membresiaTraspasar! "")?trim />
            <#assign _m2 = (membresia_traspasar! "")?trim />
            <#assign _m = "">
            <#if _m1?has_content && _m1?lower_case != 'null'>
              <#assign _m = _m1 />
            <#elseif _m2?has_content && _m2?lower_case != 'null'>
              <#assign _m = _m2 />
            </#if>
            <#if _m?has_content>
              <div class="details-row">
                <div class="label">Membresía a traspasar</div>
                <div class="value">${_m?html}</div>
              </div>
            </#if>

            <div class="details-row">
              <div class="label">Socio nuevo</div>
              <div>
                <div class="value">${socioNuevoNombre?if_exists?html}</div>
                <#if socioNuevoDoc?has_content>
                  <div class="value small">${socioNuevoDoc?if_exists?html}</div>
                </#if>
              </div>
            </div>
          </div>
        </div>

        <!-- BLOQUE CANALES -->
        <div class="channels-wrap">
          <div class="channels-title">Nuestros canales de atención</div>
          <div class="channels">
            <a class="channel" href="#">
              <span>
                <img src="${((iconContacto?if_exists)!(assetsBase + '/iconContacto.png'))?html}" alt="Centro de ayuda" width="28" height="28" />
              </span>
              Centro de ayuda
            </a>
            <a class="channel" href="#">
              <span>
                <img src="${((iconWsp?if_exists)!(assetsBase + '/iconWsp.png'))?html}" alt="Whatsapp" width="28" height="28" />
              </span>
              Whatsapp
            </a>
            <a class="channel" href="mailto:${helpEmail?if_exists?html}">
              <span>
                <img src="${((iconGmail?if_exists)!(assetsBase + '/iconGmail.png'))?html}" alt="Correo" width="28" height="28" />
              </span>
              Correo
            </a>
          </div>
        </div>

        <!-- BLOQUE AYUDA -->
        <div class="help-block support">
          <h4 class="help-title">¿Necesitas ayuda?</h4>
          <p class="help-text">Si tiene alguna pregunta, inquietud o necesita más información, no dude en comunicarse con nosotros a <a href="mailto:${helpEmail?if_exists?html}">${helpEmail?if_exists?html}</a>.</p>
        </div>

        <!-- PIE -->
        <p class="notice">Si prefiere no recibir este tipo de correo electrónico, ¿no quiere más correos electrónicos de Inclub? <a class="unsubscribe" href="#">Darse de baja</a>.</p>
      </div>
    </div>

    <div class="footer">
      Valle Encantado S.A.C, Perú.<br>
      &copy;${year?if_exists?html} Inclub
    </div>
  </div>
</div>
</body>
</html>
