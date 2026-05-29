export const createImage = (url) =>
	new Promise((resolve, reject) => {
		const image = new globalThis.Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});

export default async function getCroppedImg(imageSrc, pixelCrop, options = {}) {
	if (!pixelCrop) return null;

	const { fileType = "image/jpeg", quality = 0.9 } = options;
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) return null;

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height
	);

	return new Promise((resolve) => {
		canvas.toBlob((file) => resolve(file), fileType, quality);
	});
}