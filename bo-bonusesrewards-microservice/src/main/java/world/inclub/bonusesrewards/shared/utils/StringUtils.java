package world.inclub.bonusesrewards.shared.utils;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class StringUtils {

    public static String joinIds(Iterable<Long> ids) {
        return StreamSupport.stream(ids.spliterator(), false)
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }
    
}