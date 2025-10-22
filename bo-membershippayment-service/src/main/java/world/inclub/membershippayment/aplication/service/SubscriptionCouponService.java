package world.inclub.membershippayment.aplication.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.ISuscriptionCouponDao;
import world.inclub.membershippayment.domain.Exceptions.DuplicateCouponException;
import world.inclub.membershippayment.domain.dto.request.SuscriptionCouponRequest;
import world.inclub.membershippayment.domain.dto.response.ResponseCouponDTO;
import world.inclub.membershippayment.domain.dto.response.ResponseCouponTotalDTO;
import world.inclub.membershippayment.domain.entity.SubscriptionCoupon;
import world.inclub.membershippayment.infraestructure.repository.SuscriptionCouponRepository;
import org.springframework.dao.DuplicateKeyException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
@Slf4j
public class SubscriptionCouponService implements ISuscriptionCouponDao {

    @Autowired
    private SuscriptionCouponRepository suscriptionCouponRepository;

    @Override
    public Flux<ResponseCouponDTO> getAllCouponsPaginateAndSearch(Boolean isparner, Integer page, Integer size, String search, Integer idbusiness) {

        Integer in_page = page == 1 ? 0 : ((page-1) * size);
        Integer in_size = size < 1 ? 5 : size;
        String in_search = (search == null || search.trim().isEmpty() ) ? "" : search.trim();
        Integer in_idbus = (idbusiness == 0) ? null : idbusiness;

        return Flux.defer(() -> {

            if (in_page < 0 || in_size <= 0) {
                return Flux.empty();
            }
                return suscriptionCouponRepository.findByCustomiserParams(isparner, in_page, in_size, in_search, in_idbus);
            })
            .switchIfEmpty(Flux.empty())
            .onErrorMap(IllegalArgumentException.class, e ->
                    new IllegalArgumentException("Parámetros inválidos: " + e.getMessage()))
            .onErrorMap(Exception.class, e -> new RuntimeException("Error en el servicio: " + e.getMessage()));
    }

    @Override
    public Mono<SubscriptionCoupon> findByStateIsTrueAndCode(String code) {
        try {

            return suscriptionCouponRepository.findByStateIsTrueAndIdSubscriptionIsNullAndCode(code);

        } catch (IllegalArgumentException e) {
            return Mono.just(new SubscriptionCoupon()).doOnError(error -> {
                throw new IllegalArgumentException(e.getMessage());
            });
        }

    }

    @Override
    public Mono<SubscriptionCoupon> findByIdSuscriptionAndUserId(Integer idSuscription, Integer IdUser) {
        try {
                return suscriptionCouponRepository.findByStateIsTrueAndIdSubscriptionAndIdUser(idSuscription, IdUser);

        } catch (IllegalArgumentException e) {
            return Mono.just(new SubscriptionCoupon()).doOnError(error -> {
                throw new IllegalArgumentException(e.getMessage());
            });
        }

    }

    @Override
    public Mono<SubscriptionCoupon> createCoupon(SuscriptionCouponRequest request) {

        try {

            if (request.getDiscountPercentage() == null) {
                return Mono.error(new DuplicateCouponException("La solicitud no puede ser nula", "INVALID_REQUEST"));
            }

            if (request.getCode() == null || request.getCode().trim().isEmpty()) {
                return Mono.error(new DuplicateCouponException("El código del cupón es requerido", "MISSING_CODE"));
            }

            return suscriptionCouponRepository.findByCode(request.getCode().trim())
                    .flatMap(existingCoupon -> {
                        log.warn("Intento de crear cupón con código duplicado: {}", request.getCode());
                        return Mono.error(new DuplicateCouponException("Ya existe un cupón con el código: " + request.getCode(), "DUPLICATE_COUPON"));
                    })
                    .switchIfEmpty(Mono.defer(() -> {

                        ZoneId timeZone = ZoneId.of("America/Lima");
                        LocalDateTime dateTimeNow = LocalDateTime.now(timeZone);
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");
                        String formattedDate = dateTimeNow.format(formatter);
                        LocalDateTime createdAt = LocalDateTime.parse(formattedDate, formatter).truncatedTo(ChronoUnit.SECONDS);

                        SubscriptionCoupon createCoupon = new SubscriptionCoupon();
                        createCoupon.setIdUser(request.getIdUser());
                        createCoupon.setIdSalary(request.getIdSalary());
                        createCoupon.setDiscountPercentage(request.getDiscountPercentage());
                        createCoupon.setCode(request.getCode());
                        createCoupon.setDateStart(request.getDateStart());
                        createCoupon.setDateEnd(request.getDateEnd());
                        createCoupon.setState(request.getState());
                        createCoupon.setIdBusiness(request.getIdBusiness());
                        createCoupon.setIsPartner(request.getIsPartner());
                        createCoupon.setCreated_at(createdAt);

                        return suscriptionCouponRepository.save(createCoupon)
                                .doOnSuccess(savedCoupon ->
                                        log.info("Cupón creado con éxito: ID {}", savedCoupon.getIdCoupon()))
                                .doOnError(error -> {
                                    if (isDuplicateKeyError(error)) {
                                        log.warn("Violación de clave única al crear cupón. Código: {}", request.getCode());
                                        throw new DuplicateCouponException("El código de cupón ya existe: "+ request.getCode(), "DUPLICATE_CODE");
                                    }
                                    throw new DuplicateCouponException("Error interno al crear el cupón", "INTERNAL_ERROR");
                                });
                    }))
                    .cast(SubscriptionCoupon.class);

        } catch (Exception e){
             log.error("Error en el proceso de creación del cupón: {}", e.getMessage());
            return Mono.error(new RuntimeException("Error al crear el cupón: " + e.getMessage()));
        }

    }

    @Override
    public Mono<SubscriptionCoupon> updateCoupon(SuscriptionCouponRequest request, Integer idCoupon) {
        try {

            if (request.getDiscountPercentage() == null) {
                return Mono.error(new DuplicateCouponException("La solicitud no puede ser nula", "INVALID_REQUEST"));
            }

            if (request.getCode() == null || request.getCode().trim().isEmpty()) {
                return Mono.error(new DuplicateCouponException("El código del cupón es requerido", "MISSING_CODE"));
            }

            ZoneId timeZone = ZoneId.of("America/Lima");
            LocalDateTime dateTimeNow = LocalDateTime.now(timeZone);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");
            String formattedDate = dateTimeNow.format(formatter);
            LocalDateTime createdAt = LocalDateTime.parse(formattedDate, formatter).truncatedTo(ChronoUnit.SECONDS);

            return suscriptionCouponRepository.findByIdSubscriptionIsNullAndCode(request.getCode().trim())
                    .flatMap(coupon -> {
                        coupon.setIdSalary(request.getIdSalary());
                        coupon.setIdSubscription(request.getIdSubscription());
                        coupon.setDiscountPercentage(request.getDiscountPercentage());
                        coupon.setCode(request.getCode());
                        coupon.setDateStart(request.getDateStart());
                        coupon.setDateEnd(request.getDateEnd());
                        coupon.setState(request.getState());
                        coupon.setIdBusiness(request.getIdBusiness());
                        coupon.setIsPartner(request.getIsPartner());
                        coupon.setUpdated_at(createdAt);

                        return suscriptionCouponRepository.save(coupon)
                                .doOnSuccess(savedCoupon ->
                                        log.info("Cupón actualizado con éxito: ID {}", savedCoupon.getIdCoupon()))
                                .doOnError(error -> {
                                    if (isDuplicateKeyError(error)) {
                                        log.warn("Violación de clave única al actualizar cupón, o el cupon ya esta en uso. Código: {}", request.getCode());
                                        throw new DuplicateCouponException("El código de cupón ya existe: "+ request.getCode(), "DUPLICATE_CODE");
                                    }
                                    throw new DuplicateCouponException("Error interno al actualizar el cupón", "INTERNAL_ERROR");
                                });

                    })
                    .switchIfEmpty(Mono.defer(() -> {
                        log.warn("Intento de actualizar cupón con código duplicado: {}", request.getCode());
                        return Mono.error(new DuplicateCouponException("Ya existe un cupón con el código: " + request.getCode(), "DUPLICATE_COUPON"));
                    }))
                    .cast(SubscriptionCoupon.class);

        } catch (Exception e){
            log.error("Error en el proceso de creación del cupón: {}", e.getMessage());
            return Mono.error(new RuntimeException("Error al crear el cupón: " + e.getMessage()));
        }
    }

    @Override
    public Mono<Boolean> deleteCouponByIdentity(Integer idCoupon) {

        return suscriptionCouponRepository.findByIdCoupon(idCoupon).flatMap( existingCoupon -> {
            Boolean state = existingCoupon.getState();
            if (state) {
                state = false;
            }else{
                state = true;
            }
            existingCoupon.setState(state); // Cambia el estado a inactivo en lugar de eliminar
            return suscriptionCouponRepository.save(existingCoupon)
                    .then(Mono.just(true));
        }).switchIfEmpty(
                Mono.error(new RuntimeException("Error: No se pudo encontrar el cupón con id: " + idCoupon))
        ).map(updatedCoupon -> true)
         .onErrorResume(e -> {
             log.error("Error al eliminar el cupón: {}", e.getMessage());
             return Mono.just(false);
         });
    }

    @Override
    public Mono<ResponseCouponTotalDTO> findByCustomiserParamsAllPag(Boolean ispartner, String search, Integer idbusiness){
        Integer in_idBus = idbusiness ==0? null  : idbusiness;
        String in_search = search.trim().isEmpty() ? "" : search.trim();
        return suscriptionCouponRepository.findByCustomiserParamsAllPaginate(ispartner, in_search, in_idBus);
    }


    // Método auxiliar para detectar errores de clave duplicada
    private boolean isDuplicateKeyError(Throwable error) {
        String errorMessage = error.getMessage() != null ? error.getMessage().toLowerCase() : "";

        return error instanceof DuplicateKeyException ||
                errorMessage.contains("duplicate key") ||
                errorMessage.contains("unique constraint") ||
                errorMessage.contains("23505") || // Código de error PostgreSQL para unique violation
                errorMessage.contains("1062");    // Código de error MySQL para duplicate entry
    }


}
