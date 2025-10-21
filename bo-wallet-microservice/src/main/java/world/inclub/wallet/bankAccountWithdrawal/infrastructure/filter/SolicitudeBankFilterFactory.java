package world.inclub.wallet.bankAccountWithdrawal.infrastructure.filter;

import org.springframework.stereotype.Component;
import world.inclub.wallet.api.dtos.SolicitudeBankFilterDto;
import world.inclub.wallet.bankAccountWithdrawal.application.enums.BankStatus;

import java.util.Collections;

@Component
public class SolicitudeBankFilterFactory {

    public SolicitudeBankFilterDto buildInternalFilter() {
        SolicitudeBankFilterDto filtro = new SolicitudeBankFilterDto();
        filtro.setSearchText("");
        filtro.setFechaRegistro("");
        filtro.setPeriodIds(Collections.emptyList());
        filtro.setBankStatusIds(Collections.singletonList(BankStatus.RECIBIDO.getId()));
        filtro.setCurrencyIdBank(Collections.emptyList());
        filtro.setReviewStatusId(Collections.emptyList());
        filtro.setIdBank(1L);
        return filtro;
    }

    public SolicitudeBankFilterDto buildInternalFilterBankPreAprove() {
        SolicitudeBankFilterDto filtro = new SolicitudeBankFilterDto();
        filtro.setSearchText("");
        filtro.setFechaRegistro("");
        filtro.setPeriodIds(Collections.emptyList());
        filtro.setBankStatusIds(Collections.singletonList(BankStatus.PRE_APROBADO.getId()));
        filtro.setCurrencyIdBank(Collections.emptyList());
        filtro.setReviewStatusId(Collections.emptyList());
        filtro.setIdBank(1L);
        return filtro;
    }
}
