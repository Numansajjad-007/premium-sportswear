"use client";

const WHATSAPP_NUMBER = "923221686274"; // no + or spaces
const CONTACT_EMAIL = "premiumsportswear@gmail.com";

export default function OrderNowButton({
  productName,
  price,
  className,
}: {
  productName: string;
  price: string | number;
  className?: string;
}) {
  const message = `Hi Premium Sports Wear, I'd like to order:\n\n${productName} (from $${price})\n\nPlease send me payment details.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const emailUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Order: " + productName
  )}&body=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col gap-2 items-end">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        Order via WhatsApp
      </a>
      <a href={emailUrl} className="text-xs text-creamDim hover:text-cream underline">
        or email us
      </a>
    </div>
  );
}
