package world.inclub.ticket.domain.model;

import java.time.LocalDateTime;

public record Member(
        Long idUser,
        String name,
        String lastName,
        LocalDateTime birthdate,
        char gender,
        Integer idNationality,
        String email,
        String nroDocument,
        String districtAddress,
        String address,
        String userName,
        String password,
        Integer idResidenceCountry,
        String civilState,
        Integer boolDelete,
        String nroPhone,
        Integer idDocument,
        Integer idState,
        LocalDateTime createDate,
        String profilePicture,
        String code
) {}
