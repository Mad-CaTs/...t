package world.inclub.appnotification.shared.application.port;

public interface EmailTemplateBuilderPort<T> {

    /**
     * Builds an HTML string from the given DTO.
     *
     * @param dto the data transfer object containing the information to be included in the HTML
     * @return a String representing the HTML content
     */
    String buildHtml(T dto);

    /**
     * Gets the subject line for the email.
     *
     * @return a String representing the subject of the email
     */
    String getSubject();

}
