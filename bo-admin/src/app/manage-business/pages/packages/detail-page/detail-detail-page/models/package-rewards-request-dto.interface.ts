import { PackageDetailDto } from './package-detail-dto.interface';
import { RewardsDto } from './rewards-dto.interface';

export interface CreatePackageRewardsDto {
	packageDetail: PackageDetailDto;
	rewardsDTO: RewardsDto;
}

export interface DetailPackageRewardsDto {
	packageDetail: PackageDetailDto;
	rewardsDTO: RewardsDto;
}
