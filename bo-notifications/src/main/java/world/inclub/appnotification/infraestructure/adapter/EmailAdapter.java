package world.inclub.appnotification.infraestructure.adapter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import world.inclub.appnotification.domain.port.IEmailPort;

import javax.activation.DataSource;
import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.activation.DataHandler;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import java.io.*;
import java.net.URL;

@Repository
public class EmailAdapter implements IEmailPort {
    private static final Logger logger = LoggerFactory.getLogger(EmailAdapter.class);

    @Value("${gmail.email.sender}")
    private String sender;

    @Value("${gmail.email.password}")
    private String password;

    @Value("${gmail.email.smtp.host}")
    private String smtpHost;

    @Value("${gmail.email.name}")
    private String senderName;

    @Value("${gmail.email.smtp.port}")
    private String senderPort;

    @Override
    public void sendEmail(String email, String subject, String html, List<String> ccEmails) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", senderPort);

        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(sender, password);
            }
        });

        try {
            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(sender, senderName));
            msg.setRecipient(Message.RecipientType.TO, new InternetAddress(email));

            if (ccEmails != null && !ccEmails.isEmpty()) {
                InternetAddress[] ccAddresses = new InternetAddress[ccEmails.size()];
                int i = 0;
                for (String ccEmail : ccEmails) {
                    ccAddresses[i++] = new InternetAddress(ccEmail);
                }
                msg.setRecipients(Message.RecipientType.CC, ccAddresses);
            }

            msg.setSubject(subject, "UTF-8");
            msg.setContent(html, "text/html; charset=UTF-8");

            Transport.send(msg);
            logger.info("¡Correo electrónico enviado!");
        } catch (MessagingException | UnsupportedEncodingException e) {
            logger.error("Error al enviar el correo electrónico: " + e.getMessage());
        }
    }

    @Override
    public void sendEmailWithDocument(String email, String subject, String html, ByteArrayOutputStream outputStream) throws MessagingException, UnsupportedEncodingException, IOException {
    }

    public void sendEmailWithImageAttachment(String email, String subject, String html, List<String> ccEmails, String imageUrl) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", senderPort);

        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(sender, password);
            }
        });

        try {
            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(sender, senderName));
            msg.setRecipient(Message.RecipientType.TO, new InternetAddress(email));

            if (ccEmails != null && !ccEmails.isEmpty()) {
                InternetAddress[] ccAddresses = new InternetAddress[ccEmails.size()];
                int i = 0;
                for (String ccEmail : ccEmails) {
                    ccAddresses[i++] = new InternetAddress(ccEmail);
                }
                msg.setRecipients(Message.RecipientType.CC, ccAddresses);
            }

            msg.setSubject(subject);
            msg.setContent(html, "text/html");

            MimeBodyPart attachmentPart = new MimeBodyPart();
            URL url = new URL(imageUrl);
            InputStream inputStream = url.openStream();
            DataSource dataSource = new ByteArrayDataSource(inputStream, "application/octet-stream");
            attachmentPart.setDataHandler(new DataHandler(dataSource));
            attachmentPart.setFileName("Registro_Exitoso.jpg");

            MimeMultipart multipart = new MimeMultipart();
            multipart.addBodyPart(attachmentPart);

            msg.setContent(multipart);

            Transport.send(msg);
            logger.info("¡Correo electrónico enviado!");
        } catch (IOException | MessagingException e) {
            logger.error("Error al enviar el correo electrónico: " + e.getMessage());
        }
    }
}