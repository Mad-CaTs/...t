package world.inclub.transfer.liquidation.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import reactor.core.publisher.Mono;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Socio {

    private Integer idsocio;

    private String nombre_socio;

    private Integer estado_socio;

    private Integer idhijo;

    private Integer flagp;

    private List<Socio> children = new ArrayList<>();

    private LocalDate fechaRegistro;

    // Estado de suscripción
    private String subscriptionStatus;

    private static Socio buildFromPlacement(String name, String lastName, Integer idUser, Integer status,
                                            String subscriptionStatus, LocalDate fechaActual) {
        Socio newSocio = new Socio();
        newSocio.setNombre_socio((name != null ? name : "") + " " + (lastName != null ? lastName : ""));
        newSocio.setFechaRegistro(fechaActual);
        newSocio.setIdsocio(idUser);
        newSocio.setChildren(new ArrayList<>());
        newSocio.setFlagp(1);
        newSocio.setEstado_socio(status);
        newSocio.setSubscriptionStatus(subscriptionStatus);
        return newSocio;
    }

    public static Mono<Socio> toCastSocioPlacementReactive(String name, String lastName, Integer idUser, Integer status,
                                                           String subscriptionStatus, LocalDate fechaActual) {
        return Mono.fromCallable(() -> buildFromPlacement(name, lastName, idUser, status, subscriptionStatus, fechaActual));
    }

}
