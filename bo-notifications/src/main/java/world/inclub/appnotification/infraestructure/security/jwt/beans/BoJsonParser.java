package world.inclub.appnotification.infraestructure.security.jwt.beans;

public interface BoJsonParser {

    <T> String toJson(T object);
    <T> T fromJson(String json, Class<T> clazz);

}
