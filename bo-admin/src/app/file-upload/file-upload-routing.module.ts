import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'file-upload',
		loadComponent: () => import('./pages').then((p) => p.FileUploadPageComponent),
		children: [
			{
				path: '',
				loadComponent: () => import('./pages').then((p) => p.FileUploadComponent)
			},
			// {
			// 	path: 'consilations',
			// 	loadComponent: () => import('./pages').then((p) => p.ConsilationsComponent)
			// }
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FileUploadRoutingModule {}
