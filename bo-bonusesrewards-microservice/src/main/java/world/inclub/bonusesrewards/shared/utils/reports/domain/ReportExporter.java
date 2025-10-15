package world.inclub.bonusesrewards.shared.utils.reports.domain;

import java.util.List;

public interface ReportExporter<T> {
    byte[] export(List<T> data);

    byte[] export(List<T> data, String sheetName);

    byte[] export(List<T> data, Class<T> clazz, String sheetName);
}
