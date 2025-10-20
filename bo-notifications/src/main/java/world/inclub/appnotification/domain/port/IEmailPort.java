package world.inclub.appnotification.domain.port;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import javax.mail.MessagingException;

public interface IEmailPort {

    void sendEmail(String email, String subject, String html, List<String> ccEmails) throws MessagingException, UnsupportedEncodingException;
    void sendEmailWithDocument(String email, String subject, String html, ByteArrayOutputStream outputStream) throws MessagingException, UnsupportedEncodingException, IOException;
    void sendEmailWithImageAttachment(String email, String subject, String html, List<String> ccEmails, String imageUrl)throws MessagingException, UnsupportedEncodingException;
}
