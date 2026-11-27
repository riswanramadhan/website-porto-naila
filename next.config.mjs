/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
    qualities: [75],
    minimumCacheTTL: 2678400,
    // Batasi jumlah ukuran yang ditawarkan di srcset (default 15 ukuran per gambar)
    // supaya jumlah transformasi Vercel Image Optimization tetap kecil.
    // Gambar sumber paling lebar 2000px, jadi 1920 sudah cukup.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sqomkoswextwxeinacvv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
