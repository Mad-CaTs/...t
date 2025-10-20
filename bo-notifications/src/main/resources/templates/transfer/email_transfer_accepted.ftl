<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Transferencia aceptada - InClub</title>
  <style>
    @media screen and (max-width:600px){
      .container{width:100% !important}
      .px{padding-left:16px !important; padding-right:16px !important}
      .stack{display:block !important; width:100% !important; text-align:left !important}
      .val{text-align:left !important}
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#F2F4F7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F2F4F7;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <!-- CARD -->
        <table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" class="container" style="width:680px; max-width:680px; background:#FFFFFF; border-radius:16px; box-shadow:0 10px 24px rgba(17,24,39,.08); overflow:hidden;">
          
          <!-- Banner -->
          <tr>
            <td style="padding:0;">
              <img src="https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/Keola_correo.jpeg"
                   width="680" alt="InClub"
                   style="display:block; width:100%; height:auto; max-height:170px; object-fit:cover;">
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td class="px" style="padding:24px 36px 8px 36px; text-align:center; font-family:Inter,Arial,Helvetica,sans-serif; color:#0F172A;">
              <p style="margin:0 0 8px 0; font-size:20px; font-weight:700;">
                <#if clienteNombre?has_content>
                  Estimado/a ${clienteNombre?html}
                <#else>
                  Estimado/a usuario
                </#if>
              </p>
              <p style="margin:0; color:#475569; font-size:15px; line-height:1.65;">
                Nos complace informarle que la solicitud de transferencia de cuenta a nuevo socio ha sido aceptada exitosamente.
                <br>A continuación, le detallamos la información:
              </p>
            </td>
          </tr>

          <!-- Variables base -->
          <#assign newFirst = (user_to_nombre?if_exists)! (socioNuevoNombre?if_exists)!"">
          <#assign newLast  = (user_to_apellido?if_exists)!"">
          <#assign newDoc   = (user_to_numero_documento?if_exists)! (socioNuevoDoc?if_exists)!"">

          <#assign _u = (username_child?has_content)?then(username_child?string,"")?trim>
          <#assign _u = (_u?has_content && _u?lower_case != "null")?then(_u,"")>

          <#assign _m1 = (membresiaTraspasar! "")?trim>
          <#assign _m2 = (membresia_traspasar! "")?trim>
          <#assign _m  = "">
          <#if _m1?has_content && _m1?lower_case != "null">
            <#assign _m = _m1>
          <#else>
            <#if _m2?has_content && _m2?lower_case != "null">
              <#assign _m = _m2>
            </#if>
          </#if>

          <!-- Resolver idTransferType de forma segura sin depender de ?if_exists en cadena -->
          <#assign _tt_candidates = []>
          <#-- body.transferRequest.idTransferType -->
          <#if body??>
            <#if body.transferRequest?? && body.transferRequest.idTransferType??>
              <#assign _tt_candidates = _tt_candidates + [body.transferRequest.idTransferType]>
            </#if>
            <#-- body.idTransferType (por si viene directo en body) -->
            <#if body.idTransferType??>
              <#assign _tt_candidates = _tt_candidates + [body.idTransferType]>
            </#if>
          </#if>
          <#-- top-level variantes -->
          <#if idTransferType??><#assign _tt_candidates = _tt_candidates + [idTransferType]></#if>
          <#if id_transfer_type??><#assign _tt_candidates = _tt_candidates + [id_transfer_type]></#if>
          <#if transfer_type??><#assign _tt_candidates = _tt_candidates + [transfer_type]></#if>

          <#assign _tt_num = -1>
          <#list _tt_candidates as _cand>
            <#if _tt_num == -1>
              <#if _cand?is_number>
                <#assign _tt_num = _cand?int>
              <#else>
                <#assign _s = (_cand?string!"")?trim>
                <#if _s?has_content>
                  <#assign _digits = _s?replace("[^0-9]","","r")>
                  <#if _digits?has_content>
                    <#attempt><#assign _tt_num = _digits?number?int><#recover></#attempt>
                  </#if>
                </#if>
              </#if>
            </#if>
          </#list>

          <!-- Panel -->
          <tr>
            <td class="px" style="padding:14px 36px 20px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="max-width:560px; margin:0 auto; border:1px solid #EEF2F6; border-radius:12px; background:#FFFFFF;">
                
                <!-- Cabecera -->
                <tr>
                  <td style="background:#F8FAFC; padding:14px 18px; border-top-left-radius:12px; border-top-right-radius:12px;">
                    <div style="font-size:14px; font-weight:600; color:#1F2937;">${transfer_type_label?if_exists?html}</div>
                    <div style="font-size:12px; color:#64748B;">
                      <#if fecha?has_content>${fecha?html}</#if>
                    </div>
                  </td>
                </tr>

                <!-- Patrocinador -->
                <tr>
                  <td style="padding:14px 18px; border-top:1px solid #EEF2F6;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:13px; color:#6B7280;" align="left">Patrocinador:</td>
                        <td style="font-size:14px; color:#0F172A; font-weight:700;" align="right">
                          ${patrocinadorNombre?if_exists?html}
                          <#if patrocinadorDoc?has_content>
                            <div style="font-size:12px; color:#94A3B8;">${patrocinadorDoc?html}</div>
                          </#if>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Perfil -->
                <#if _u?has_content>
                  <tr>
                    <td style="padding:14px 18px; border-top:1px solid #EEF2F6;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-size:13px; color:#6B7280;" align="left">Perfil a traspasar:</td>
                          <td style="font-size:14px; color:#0F172A; font-weight:700;" align="right">${_u?html}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </#if>

                <!-- Membresía -->
                <#if _m?has_content>
                  <tr>
                    <td style="padding:14px 18px; border-top:1px solid #EEF2F6;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-size:13px; color:#6B7280;" align="left">Membresía a traspasar:</td>
                          <td style="font-size:14px; color:#0F172A; font-weight:700;" align="right">${_m?html}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </#if>

                <!-- Socio nuevo -->
                <tr>
                  <td style="padding:14px 18px; border-top:1px solid #EEF2F6;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:13px; color:#6B7280;" align="left">Socio nuevo:</td>
                        <td style="font-size:14px; color:#0F172A; font-weight:700;" align="right">
                          ${socioNuevoNombre?if_exists?html}
                          <#if socioNuevoDoc?has_content>
                            <div style="font-size:12px; color:#94A3B8;">${socioNuevoDoc?html}</div>
                          </#if>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Credenciales (iniciales en mayúscula; ocultas en tipo 3 o 4) -->
                <#assign showCred = (_tt_num != 3) && (_tt_num != 4)>
                <#assign __uname = "">
                <#assign __pwd = "">
                <#-- Generar credenciales sólo si corresponde -->
                <#if showCred>
                  <#if newFirst?has_content><#assign __uname = __uname + newFirst?substring(0,1)?upper_case></#if>
                  <#if newLast?has_content><#assign __uname = __uname + newLast?substring(0,1)?upper_case></#if>
                  <#if newDoc?has_content><#assign __uname = __uname + newDoc></#if>
                  <#assign __pwd = __uname>
                </#if>

                <!-- Mostrar credenciales sólo si showCred y hay username -->
                <#if (showCred && __uname?has_content)>
                    <tr>
                      <td style="padding:14px 18px; border-top:1px solid #EEF2F6;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="font-size:13px; color:#6B7280;" align="left">Usuario:</td>
                            <td style="font-size:14px; color:#0F172A; font-weight:700;" align="right">${__uname?html}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:14px 18px; border-top:1px solid #EEF2F6;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="font-size:13px; color:#6B7280;" align="left">Contraseña:</td>
                            <td style="font-size:14px; color:#0F172A; font-weight:700;" align="right">${__pwd?html}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                </#if>

              </table>
            </td>
          </tr>

          <!-- Canales -->
          <tr>
            <td class="px" style="padding:6px 36px 18px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; margin:0 auto;">
                <tr>
                  <td align="center" style="font-size:14px; color:#64748B; font-weight:600; padding-bottom:10px;">Nuestros canales de atención</td>
                </tr>
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:8px 12px;" align="center">
                          <img src="${iconContacto?html}" width="28" height="28" alt="Centro de ayuda" style="display:block;">
                          <div style="font-size:13px;"><a href="#" style="color:#1E6DE8; text-decoration:none;">Centro de ayuda</a></div>
                        </td>
                        <td style="padding:8px 12px;" align="center">
                          <img src="${iconWsp?html}" width="28" height="28" alt="Whatsapp" style="display:block;">
                          <div style="font-size:13px;"><a href="#" style="color:#1E6DE8; text-decoration:none;">Whatsapp</a></div>
                        </td>
                        <td style="padding:8px 12px;" align="center">
                          <img src="${iconGmail?html}" width="28" height="28" alt="Correo" style="display:block;">
                          <div style="font-size:13px;"><a href="mailto:${helpEmail?html}" style="color:#1E6DE8; text-decoration:none;">Correo</a></div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" class="container" style="width:680px; max-width:680px; margin-top:16px;">
          <tr>
            <td align="center" style="font-family:Inter,Arial,Helvetica,sans-serif; color:#94A3B8; font-size:12px;">
              Si prefiere no recibir este tipo de correo electrónico, puede
              <a href="#" style="color:#6B7280; text-decoration:underline;">darse de baja</a>.<br>
              Valle Encantado S.A.C., Perú. © ${year?if_exists?html} Inclub
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
