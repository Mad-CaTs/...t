package world.inclub.transfer.liquidation.api.dtos;

public record PackageDetailUpdatedEventDto(
        Integer idPackage,
        Integer idPackageDetail,
        Integer updatedPoints,
        Integer updatedPointsByFee
) {}
