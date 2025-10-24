export const ImagenData = (file: any) => {
	if (!file) return null;
	const size = file.size / (1024 * 1024);
	let onlyName: string[] = file.name.split('.');
	onlyName.pop();
	const nameString = onlyName.join('');
	const name = nameString.length > 6 ? nameString.slice(0, 6) + '...' : nameString;
	const extension = file.name.split('.').pop();
	return { size, name, extension };
};

export const ImagenUri = (file) => {
	if (!file) return null;
	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
	if (!imageExtensions.includes(ImagenData(file).extension?.toLocaleLowerCase() || '')) return null;
	const uri = URL.createObjectURL(file);
	return uri;
};


/* export const ImagenBase64 = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}; */

/* export const ImagenBase64 = (file) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = (e: any) => {
		console.log('file', file);
		console.log('e', e);

		const base4 = e.target.result;
		return base4;
	}; */
/*   export const ImagenBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          console.log('Archivo:', file); 
          console.log('Evento:', e); 
            const base64 = e.target.result;
            resolve(base64);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    }); */
/* } */


