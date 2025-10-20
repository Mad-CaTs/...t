<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud de traspaso - InClub</title>
  <style type="text/css">
    body { margin:0; padding:0; background-color:#f3f6f9; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    .container { width:100%; max-width:640px; margin:0 auto; padding:24px 16px; }
    .header-wrap { text-align:center; }
    .header-gradient { background: linear-gradient(90deg,#00a9e0 0%,#ff8a00 100%); border-radius:12px; padding:0; }
    .logos { display:block; width:100%; }
    .logo { display:block; width:100%; height:auto; max-height:140px; margin:0 auto; object-fit:cover; border-radius:12px; }
    .card { background:#ffffff; border-radius:12px; overflow:visible; box-shadow:0 8px 24px rgba(0,0,0,0.06); margin-top:-20px; }
    .inner { padding:34px 30px 28px 30px; color:#12202b; }
    .greeting { font-weight:700; font-size:18px; margin:0 0 8px 0; text-align:center; }
    .intro { color:#6b7b86; font-size:14px; line-height:1.6; margin:0 0 18px 0; text-align:center; }
    .details-box { background:#fbfdfe; border-radius:10px; padding:14px 14px; border:1px solid #eef4f7; box-shadow:0 1px 0 rgba(0,0,0,0.03); margin:16px 0; }
    .details-table td { vertical-align:middle; padding:10px 12px; }
    .details-table tr.divider td { border-top:1px solid #eef4f7; padding-top:12px; }
    .details-value { color:#12202b; font-weight:700; font-size:14px; text-align:right; }
    .details-secondary { font-size:11px; color:#94a3b8; text-align:right; margin-top:4px; }
    .label { color:#8b98a3; font-size:13px; }
    .muted { color:#94a3b8; font-size:12px; }
    .channels { text-align:center; padding:18px 0 6px 0; }
    .channel-item { display:inline-block; width:120px; padding:6px 8px; text-align:center; }
    .channel-icon { width:48px; height:48px; margin:0 auto 8px auto; border-radius:10px; line-height:48px; font-size:22px; }
    .channel-label { color:#1976b8; font-size:13px; font-weight:700; }
    .help { background:#ffffff; border:1px solid #eef4f7; padding:14px; border-radius:8px; margin-top:12px; }
    .help h4 { margin:0 0 6px 0; font-size:15px; color:#12202b; }
    .help p { margin:0; color:#6b7b86; font-size:13px; }
    .footer { font-size:12px; color:#9aa7b3; text-align:center; padding:18px 6px; }
    @media screen and (max-width:480px) {
      .inner { padding:22px 16px; }
      .channel-item { width:90px; }
      .logo { max-width:320px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header-wrap">
      <div class="header-gradient">
        <div class="logos">
          <img class="logo" src="https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/Keola_correo.jpeg" alt="InClub logos">
        </div>
      </div>
    </div>

    <!-- Card principal -->
    <div class="card">
      <div class="inner" style="padding:20px 20px 18px 20px;">
        <div style="max-width:540px; margin:0 auto 6px auto; text-align:left;">
          <p class="greeting" style="margin:0 0 6px 0; font-size:14px; color:#12202b; font-weight:700; text-align:center;">
            <#if user_from_nombre?has_content || user_from_last_name?has_content>
              Estimado ${user_from_nombre} ${user_from_last_name}
            <#else>
              Estimado (nombre del cliente o usuario)
            </#if>
          </p>
          <p class="intro" style="margin:4px 0 10px 0; font-size:13px; line-height:1.45; color:#6b7b86; text-align:center;">
            Nos complace informarle que la solicitud de transferencia de cuenta a nuevo socio ha sido registrada exitosamente. A continuación, le detallamos la información:
          </p>
          <p class="muted" style="margin:6px 0 12px 0; font-size:12px; color:#8b98a3; text-align:center;">
            <#if request_date?has_content>
              ${request_date}
            <#elseif fecha?has_content>
              ${fecha}
            </#if>
          </p>
        </div>

        <!-- Caja de detalles -->
        <div class="details-box">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="details-table">
            <tr>
              <td style="font-size:13px; color:#8b98a3;">${transfer_type_label?if_exists?html}</td>
              <td style="font-size:13px; color:#8b98a3; text-align:right;">
                <#if request_date?has_content>
                  ${request_date}
                <#elseif fecha?has_content>
                  ${fecha}
                </#if>
              </td>
            </tr>

            <tr class="divider"><td colspan="2"></td></tr>

            <!-- Patrocinador -->
            <tr>
              <td style="width:60%;">
                <div class="label">Patrocinador:</div>
              </td>
              <td style="width:40%;">
                <div class="details-value">${sponsor_nombre} ${sponsor_last_name}</div>
                <#if sponsor_username?has_content>
                  <div class="details-secondary">${sponsor_username}</div>
                </#if>
              </td>
            </tr>

            <!-- Perfil a traspasar: show ONLY when username_child exists and is not a literal 'null'/'none'/'undefined' -->
            <#assign _u = (username_child?has_content)?then(username_child?string, "") />
            <#assign _u = _u?trim />
            <#assign _showPerfil = _u?has_content && (_u?lower_case != 'null') && (_u?lower_case != 'none') && (_u?lower_case != 'undefined') />
            <#if _showPerfil>
              <tr class="divider"><td colspan="2"></td></tr>
              <tr>
                <td><div class="label">Perfil a traspasar:</div></td>
                <td>
                  <div class="details-value">${_u?html}</div>
                </td>
              </tr>
            </#if>

            <!-- Membresía a traspasar -->
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
              <tr class="divider"><td colspan="2"></td></tr>
              <tr>
                <td><div class="label">Membresía a traspasar:</div></td>
                <td>
                  <div class="details-value">${_m?html}</div>
                </td>
              </tr>
            </#if>

            <tr class="divider"><td colspan="2"></td></tr>

            <!-- Socio nuevo -->
            <tr>
              <td><div class="label">Socio nuevo:</div></td>
              <td>
                <div class="details-value">${user_to_nombre} ${user_to_apellido}</div>
                <#if user_to_numero_documento?has_content>
                  <div class="details-secondary">${user_to_numero_documento}</div>
                </#if>
              </td>
            </tr>
          </table>
        </div>

        <!-- Canales -->
        <#assign assetsBase = (assetsBaseUrl?if_exists)!"/assets/transfer"> 
        <div class="channels">
          <div style="font-weight:700; color:#4b5960; margin-bottom:8px;">Nuestros canales de atención</div>
          <div>
            <div class="channel-item">
              <div class="channel-icon" style="background:#e6f6ff;">
                <img src="${((iconContacto?if_exists)!(assetsBase + '/iconContacto.png'))?html}" alt="Centro de ayuda" width="48" height="48" style="display:block;border-radius:8px;" />
              </div>
              <div class="channel-label">Centro de ayuda</div>
            </div>

            <div class="channel-item">
              <div class="channel-icon" style="background:#e9fff0;">
                <img src="${((iconWsp?if_exists)!(assetsBase + '/iconWsp.png'))?html}" alt="Whatsapp" width="48" height="48" style="display:block;border-radius:8px;" />
              </div>
              <div class="channel-label">Whatsapp</div>
            </div>

            <!-- Correo con mailto -->
            <div class="channel-item">
              <a href="mailto:${helpEmail?if_exists?html}" style="text-decoration:none;display:inline-block;">
                <div class="channel-icon" style="background:#e6fbff;">
                  <img src="${((iconGmail?if_exists)!(assetsBase + '/iconGmail.png'))?html}" alt="Enviar correo" width="48" height="48" style="display:block;border-radius:8px;border:0;outline:none;">
                </div>
                <div class="channel-label" style="color:#1976b8;">Correo</div>
              </a>
            </div>
          </div>
        </div>

        <!-- Ayuda -->
        <div class="help">
          <h4>¿Necesitas ayuda?</h4>
          <p>Si tiene alguna pregunta, inquietud o necesita más información, no dude en comunicarse con nosotros a 
            <a href="mailto:${helpEmail}" style="color:#1976b8;">${helpEmail}</a>
          </p>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Si prefiere no recibir este tipo de correo electrónico, <a href="#" style="color:#6b7280;">Darse de baja</a></div>
      <div style="margin-top:8px;">Valle Encantado S.A.C, Perú. &copy;${year} Inclub</div>
    </div>
  </div>
</body>
</html>
