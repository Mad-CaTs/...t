import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UserInfoService {
	constructor() { }

	public get userInfo() {
		let userData = JSON.parse(localStorage.getItem('user_info'));

		userData = {
			nameCode: `${userData?.name.split('').shift()}${userData?.lastName.split('').shift()}`,
			headerName: `${userData?.name.split(' ').shift()} ${userData?.lastName.split(' ').shift()}`,
			...userData
		};

		return userData;
	}

	public get disabled() {
		// var data = this.userInfo;
		// if ("idState" in data) {
		// 	if (data.idState == 15) return true;
		// 	return false;
		// }
		// return true;
		// Este es un cambio temporal para permitir a los usuarios que tengan su estado en liquidación puedan comprar paquetes
		return false;
	}
}
		