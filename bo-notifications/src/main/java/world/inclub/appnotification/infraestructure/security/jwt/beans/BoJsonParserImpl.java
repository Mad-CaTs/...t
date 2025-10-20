package world.inclub.appnotification.infraestructure.security.jwt.beans;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class BoJsonParserImpl implements BoJsonParser {

    final Gson mapper;

    @Override
    public <T> String toJson(T object) {
        return mapper.toJson(object);
    }

    @Override
    public <T> T fromJson(String json, Class<T> clazz) {
        return mapper.fromJson(json, clazz);
    }
}
