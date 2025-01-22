import { Montserrat } from "next/font/google";
import "./globals.css";
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export const metadata = {
  title: "Your App Name",
  description: "Your app description",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
