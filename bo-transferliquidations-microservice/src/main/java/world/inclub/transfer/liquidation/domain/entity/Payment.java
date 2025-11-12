package world.inclub.transfer.liquidation.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.PAYMENT, schema = "bo_membership")
public class Payment {

	@Id
	@Column("idpayment")
	private Integer idPayment;

	@Column("idsuscription")
	private int idSuscription;

	@Column("quotedescription")
	private String quoteDescription;

	@Column("nextexpiration")
	private LocalDateTime nextExpiration;

	@Column("dollarexchange")
	private BigDecimal dollarExchange;

	@Column("quotausd")
	private BigDecimal quotaUsd;

	@Column("percentage")
	private BigDecimal percentage;

	@Column("statepaymentid")
	private int statePaymentId;

	@Column("obs")
	private String obs;

	@Column("paydate")
	private LocalDateTime payDate;

	@Column("pts")
	private BigDecimal pts;

	@Column("isquoteinitial")
	private int isQuoteInitial;

	@Column("positiononschedule")
	private int positionOnSchedule;

	@Column("numberquotepay")
	private int numberQuotePay;

	@Column("amortizationusd")
	private BigDecimal amortizationUsd;

	@Column("capitalbalanceusd")
	private BigDecimal capitalBalanceUsd;

	@Column("totaloverdue")
	private BigDecimal totalOverdue;

	@Column("percentoverduedetailid")
	private int percentOverdueDetailId;

	/*@Transient
	private List<PaymentVoucher> paymentVouchers;*/
    
}