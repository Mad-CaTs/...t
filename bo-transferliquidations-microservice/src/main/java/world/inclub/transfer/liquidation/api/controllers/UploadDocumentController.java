package world.inclub.transfer.liquidation.api.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
// ...existing imports
import java.util.Map;
import java.util.HashMap;
import reactor.core.publisher.Flux;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.UploadDocumentService;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@Slf4j

public class UploadDocumentController {

    private final UploadDocumentService uploadDocumentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<Map<String, String>>> uploadImage(@RequestPart("file") Flux<FilePart> files,
                                                    @RequestPart("folderNumber") String folderNumber) {
        return uploadDocumentService.uploadImages(files, folderNumber)
                .map(urls -> {
                    Map<String, String> res = new HashMap<>();
                    res.put("dni_url", urls.size() > 0 ? urls.get(0) : null);
                    res.put("dni_receptor_url", urls.size() > 2 ? urls.get(2) : null);
                    res.put("declaration_jurada_url", urls.size() > 1 ? urls.get(1) : null);
                    return ResponseEntity.ok().body(res);
                });
    }
}