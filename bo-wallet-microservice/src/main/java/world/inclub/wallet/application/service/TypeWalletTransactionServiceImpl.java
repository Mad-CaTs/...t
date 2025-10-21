package world.inclub.wallet.application.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.TypeWalletTransactionResponseDTO;
import world.inclub.wallet.application.service.interfaces.ITypeWalletTransactionService;
import world.inclub.wallet.domain.entity.TypeWalletTransaction;
import world.inclub.wallet.domain.enums.CodeTypeWalletTransaction;
import world.inclub.wallet.domain.enums.TransactionCategory;

import world.inclub.wallet.domain.port.ITypeWalletTransactionPort;

@Service
public class TypeWalletTransactionServiceImpl implements ITypeWalletTransactionService {

    private final ITypeWalletTransactionPort iTypeWalletTransactionPort;

    public TypeWalletTransactionServiceImpl( ITypeWalletTransactionPort iTypeWalletTransactionPort){
        this.iTypeWalletTransactionPort = iTypeWalletTransactionPort;
    }

    @Override
    public BigDecimal GetValueRealTypeTransaction(BigDecimal absoluteValue, int idTransactionCategory) {
         BigDecimal realValue;
        TransactionCategory type = TransactionCategory.fromValue(idTransactionCategory);

        switch (type) {

            case Ingreso:
            realValue = absoluteValue.abs();
                return realValue;

            case Egreso:
            if (absoluteValue.signum()> 0) {
                realValue = absoluteValue.negate();
            } else {
                realValue = BigDecimal.ZERO;
            }
            return realValue;

            case Deuda:
            //la deuda es como un ingreso nada más que se genera otro flujo
                realValue = absoluteValue.abs();
                return realValue;
                

            case PagoDeuda:
                // el pago de deuda es como un egreso, solo que sigue otro flujo
                if (absoluteValue.signum()> 0) {
                    realValue = absoluteValue.negate();
                } else {
                    realValue = BigDecimal.ZERO;
                }
                return realValue;

            default:
                return BigDecimal.ZERO;
                

            
        }
        
    }

    @Override
    public Mono<TypeWalletTransaction> getTypeWalletTransaction(int idTypeWalletTransaction) {
        return iTypeWalletTransactionPort.geTypeWalletTransactionByIdUser(idTypeWalletTransaction);
    }

    @Override
    public Flux<TypeWalletTransaction> listTypeWalletTransaction() {
        List<Integer> typeBonusIds = List.of(
                CodeTypeWalletTransaction.BONO_RECOMENDACION_DIRECTA.getValue(),
                CodeTypeWalletTransaction.BONIFICACION_EQUIPO.getValue(),
                CodeTypeWalletTransaction.BONO_SEGUNDA_MEMBRESIA.getValue(),
                CodeTypeWalletTransaction.BONO_MIGRACION.getValue(),
                CodeTypeWalletTransaction.MEMBRESIAS_EXTRAS.getValue()
        );
        return iTypeWalletTransactionPort.listTypeWalletTransactionByIds(typeBonusIds);
    }

}
