package world.inclub.appnotification.infraestructure.security.utils.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.infraestructure.security.dto.KeolaSecurityDtoResponse;
import world.inclub.appnotification.infraestructure.security.enumeration.KeolaStatusEnum;
import world.inclub.appnotification.infraestructure.security.jwt.beans.BoJsonParser;


import java.nio.charset.StandardCharsets;

@RequiredArgsConstructor
@Component
public class AuthFailureHandler {

    final BoJsonParser boJsonParser;

    public Mono<Void> formatResponse(KeolaStatusEnum boStatus, ServerHttpResponse response) {
        response.getHeaders()
                .add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        String msg = boJsonParser.toJson(KeolaSecurityDtoResponse.builder().status(boStatus.getStatus()).build());
        DataBuffer buffer = response.bufferFactory().wrap(msg.getBytes(StandardCharsets.UTF_8));
        return response.writeWith(Mono.just(buffer));
    }

}
