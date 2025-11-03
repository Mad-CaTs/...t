package world.inclub.wallet.application.service.interfaces;

import world.inclub.wallet.infraestructure.serviceagent.dtos.response.UserWalletDataResponse;

import java.io.ByteArrayInputStream;

public interface WalletExcelReportService {

    ByteArrayInputStream generateWalletReport(UserWalletDataResponse data);
}
