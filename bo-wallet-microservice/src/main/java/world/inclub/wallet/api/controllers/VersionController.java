package world.inclub.wallet.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;
import world.inclub.wallet.infraestructure.serviceagent.service.DocumentService;
import world.inclub.wallet.infraestructure.serviceagent.service.interfaces.IAdminPanelService;

@Slf4j
@RestController
@RequestMapping("/version")
@RequiredArgsConstructor
public class VersionController {

    private final DocumentService iService;
    private final IAdminPanelService iAdminPanelService;
    //private final KafkaRequestReplyAccountService service;
//Funciona
    @GetMapping("/")
    public Mono<ResponseEntity<Object>> getAlls() {
        
        Mono<String> version = Mono.just("Version 4.0");

        return Mono.just(
                ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(version));

    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<Object>> uploadImage(@RequestPart("file") Mono<FilePart> file) {
        String folderNumber = "14"; // Puedes ajustar esto según sea necesario

        return ResponseHandler.generateResponse(HttpStatus.OK, iService.postDataToExternalAPI(file, folderNumber), true); 
       

    }

    @GetMapping("/bank")
    public Mono<ResponseEntity<Object>> getCurrency(){
        return ResponseHandler.generateResponse(HttpStatus.OK, iAdminPanelService.getBanks(), true);
    }
    @GetMapping("/currency")
    public Mono<ResponseEntity<Object>> getCurrencys(){
        return ResponseHandler.generateResponse(HttpStatus.OK, iAdminPanelService.getCurrencies(), true);
    }
}


