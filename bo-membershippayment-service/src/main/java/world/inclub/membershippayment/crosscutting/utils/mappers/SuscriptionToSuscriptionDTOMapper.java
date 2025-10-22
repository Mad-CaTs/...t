package world.inclub.membershippayment.crosscutting.utils.mappers;

import world.inclub.membershippayment.domain.dto.SuscriptionDTO;
import world.inclub.membershippayment.domain.entity.Suscription;

public class SuscriptionToSuscriptionDTOMapper {

    public SuscriptionDTO map(Suscription suscription) {
        SuscriptionDTO suscriptionDTO = new SuscriptionDTO();

        suscriptionDTO.setIdSuscription(suscription.getIdSuscription().intValue());
        suscriptionDTO.setIdUser(suscription.getIdUser());
        suscriptionDTO.setCreationDate(suscription.getCreationDate());
        suscriptionDTO.setStatus(suscription.getStatus());
        suscriptionDTO.setModificationDate(suscription.getModificationDate());
        suscriptionDTO.setBoolmigration(suscription.getIsMigrated());
        suscriptionDTO.setPackageDetailId(suscription.getIdPackageDetail());
        suscriptionDTO.setIdPackage(suscription.getIdPackage());
        suscriptionDTO.setNextExpiration(suscription.getNextExpirationDate());

        return suscriptionDTO;
    }
}
