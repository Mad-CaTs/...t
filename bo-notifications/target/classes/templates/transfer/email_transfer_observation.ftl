<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <title>Detalles de transferencia - InClub</title>
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <style>
    @media (max-width:600px){
      .container{width:100%!important}
      .px{padding-left:16px!important;padding-right:16px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#F2F4F7;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F2F4F7;">
    <tr>
      <td align="center" style="padding:36px 12px;">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="680" class="container" style="width:680px;max-width:680px;background:#FFFFFF;border-radius:16px;box-shadow:0 10px 24px rgba(17,24,39,.08);overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div role="img" aria-label="InClub header" style="background:linear-gradient(90deg,#00A9E0 0%,#FF8A00 100%);">
                <img src="https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/Keola_correo.jpeg"
                     alt="InClub"
                     width="680"
                     style="display:block;width:100%;height:auto;max-height:170px;object-fit:cover;">
              </div>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:28px 36px 24px 36px;color:#0F172A;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <#include "transfer_helpers.ftl">
              <#assign assetsBase = (assetsBaseUrl?if_exists)!"/assets/transfer">

              <p style="margin:0 0 6px 0;font-size:18px;font-weight:700;line-height:1.35;">Estimad@ ${clienteNombre?if_exists?html}</p>
              <p style="margin:0 0 18px 0;font-size:15px;color:#475569;">
                Su documento de identidad fue <strong style="color:#111827;">Observado</strong>
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F5F6FA;border:1px solid #E3E7ED;border-radius:12px;">
                <tr>
                  <td style="padding:22px 26px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0F172A;">

                    <div style="margin:0 0 6px 0;font-size:14px;font-weight:700;color:#D93025;">Motivo del rechazo</div>

                    <#if idTransferObservationType?has_content || id_transfer_observation_type?has_content>
                      <#if idTransferObservationType?has_content>
                        <#assign obs_id = idTransferObservationType />
                      <#else>
                        <#assign obs_id = id_transfer_observation_type />
                      </#if>
                      <#attempt>
                        <#assign __obs_num = obs_id?number>
                        <#if __obs_num == 1>
                          <div style="margin:0 0 10px 0;font-size:15px;font-weight:700;color:#111827;">Documento ilegible</div>
                        <#elseif __obs_num == 2>
                          <div style="margin:0 0 10px 0;font-size:15px;font-weight:700;color:#111827;">Otros</div>
                        <#else>
                          <div style="margin:0 0 10px 0;font-size:15px;font-weight:700;color:#111827;">${obs_id?html}</div>
                        </#if>
                      <#recover>
                        <div style="margin:0 0 10px 0;font-size:15px;font-weight:700;color:#111827;">${obs_id?html}</div>
                      </#recover>
                    </#if>

                    <div style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#1E63C3;text-decoration:underline;">
                      Mensaje adicional o solución alternativa
                    </div>

                    <div style="margin:0;font-size:14px;line-height:1.7;color:#0F172A;">
                      ${detailObservationTransfer?if_exists?html}
                    </div>

                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:20px auto 0 auto;">
                      <tr>
                        <td align="center">
                          <p style="margin:0;font-size:14px;line-height:1.6;color:#0F172A;font-weight:600;">
                            Por favor volver a realizar la solicitud de transferencia
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <div style="height:16px;line-height:16px;font-size:16px;">&nbsp;</div>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="680" class="container" style="width:680px;max-width:680px;background:#FFFFFF;border:1px solid #E5EDFF;border-radius:12px;box-shadow:0 1px 2px rgba(16,24,40,.08);margin-top:18px;">
          <tr>
            <td class="px" style="padding:18px 20px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <div style="margin:0 0 8px 0;font-size:16px;font-weight:700;color:#1F2937;">¿Necesitas ayuda?</div>
              <div style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
                Si estás teniendo problemas, envía tus comentarios o información de errores a
                <a href="mailto:${helpEmail?if_exists?html}" style="color:#1E6DE8;text-decoration:underline;">${helpEmail?if_exists?html}</a>
                o llámanos al <a href="tel:+51987743819" style="color:#1E6DE8;text-decoration:underline;">+51 987 743 819</a>.
              </div>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="680" class="container" style="width:680px;max-width:680px;margin-top:16px;">
          <tr>
            <td style="font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#94A3B8;font-size:12px;line-height:1.6;">
              Este correo electrónico fue enviado a
              <a href="mailto:inclubnotification@inclub.world" style="color:#1E6DE8;text-decoration:underline;">inclubnotification@inclub.world</a>.
              Si prefiere no recibir este tipo de correo electrónico, ¿no quiere más correos electrónicos de Inclub?
              <a href="#" style="color:#6B7280;text-decoration:underline;">Darse de baja</a>.<br>
              Inclub World S.A.C., Perú. &nbsp; © 2025 Inclub
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
