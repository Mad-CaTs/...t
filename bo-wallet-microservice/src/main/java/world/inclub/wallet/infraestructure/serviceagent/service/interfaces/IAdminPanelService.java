package world.inclub.wallet.infraestructure.serviceagent.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.ExchangeRateDTO;
import world.inclub.wallet.api.dtos.period.PeriodResponse;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.UserAdminDTO;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.BankResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.CountryResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.CurrencyResponse;

import java.util.List;

public interface IAdminPanelService {

    Mono<List<BankResponse>> getBanks();

    Mono<List<CurrencyResponse>> getCurrencies();

    Mono<List<CountryResponse>> getCountrys();

    Mono<ExchangeRateDTO> getTypeExchange();

    Mono<List<PeriodResponse>> getPeriodsByIds(List<Integer> ids);

    Mono<UserAdminDTO> getUserByUsername(String username);

    Mono<UserAdminDTO> getUserById(Integer id);
}
