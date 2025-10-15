package world.inclub.bonusesrewards.shared.utils.reports.infrastructure;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.write.metadata.style.WriteCellStyle;
import com.alibaba.excel.write.metadata.style.WriteFont;
import com.alibaba.excel.write.style.HorizontalCellStyleStrategy;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.logging.LoggerService;
import world.inclub.bonusesrewards.shared.utils.reports.domain.ReportExporter;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ExcelReportExporter<T>
        implements ReportExporter<T> {

    private final LoggerService logger;

    @Override
    @SuppressWarnings("unchecked")
    public byte[] export(List<T> data) {
        if (data == null || data.isEmpty()) {
            throw new IllegalArgumentException("Data cannot be null or empty");
        }
        return writeExcel(data, (Class<T>) data.get(0).getClass(), "Report");
    }

    @Override
    @SuppressWarnings("unchecked")
    public byte[] export(List<T> data, String sheetName) {
        if (data == null || data.isEmpty()) {
            throw new IllegalArgumentException("Data cannot be null or empty");
        }
        return writeExcel(data, (Class<T>) data.get(0).getClass(), sheetName);
    }

    @Override
    public byte[] export(List<T> data, Class<T> clazz, String sheetName) {
        return writeExcel(data, clazz, sheetName);
    }

    private byte[] writeExcel(List<T> data, Class<T> clazz, String sheetName) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            // Style for header
            WriteCellStyle headWriteCellStyle = new WriteCellStyle();
            WriteFont headWriteFont = new WriteFont();
            headWriteFont.setFontName("Calibri");
            headWriteFont.setFontHeightInPoints((short) 11);
            headWriteFont.setBold(true);
            headWriteCellStyle.setWriteFont(headWriteFont);
            headWriteCellStyle.setHorizontalAlignment(HorizontalAlignment.CENTER);
            headWriteCellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());

            // Style for content
            WriteCellStyle contentWriteCellStyle = new WriteCellStyle();
            WriteFont contentWriteFont = new WriteFont();
            contentWriteFont.setFontName("Calibri");
            contentWriteFont.setFontHeightInPoints((short) 10);
            contentWriteCellStyle.setWriteFont(contentWriteFont);

            HorizontalCellStyleStrategy horizontalCellStyleStrategy = new HorizontalCellStyleStrategy(
                    headWriteCellStyle, contentWriteCellStyle);

            EasyExcel.write(outputStream, clazz)
                    .registerWriteHandler(horizontalCellStyleStrategy)
                    .sheet(sheetName)
                    .doWrite(data);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel report", e);
        }
    }
}