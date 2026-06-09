const CONTENT = `# Kwise World

Kwise World is Nigeria's trusted online gadget store. We sell tested & verified brand-new and UK-used iPhones, Samsung phones, laptops (HP, Lenovo, Dell), and accessories, with fast delivery nationwide from our base in Ibadan, Oyo State.

## Products
- https://kwiseworld.com/category/all — Browse all gadgets: phones, laptops, accessories
- https://kwiseworld.com/category/phones — iPhones, Samsung and other smartphones
- https://kwiseworld.com/category/laptops — HP, Lenovo, Dell laptops, brand new and UK-used

## Trade-in / Swap Estimator
- https://kwiseworld.com/swap — Get an instant Naira estimate for your iPhone swap. Tell us your current iPhone model, storage, and condition; choose the upgrade you want; we quote the top-up you pay. Proprietary trade-in values updated regularly.

## One-Time Offers
- https://kwiseworld.com/offers — Single-unit deals on unique devices. Once sold, gone forever.

## About / Contact
- https://kwiseworld.com/ — Homepage with featured picks and trust signals
`;

export function GET() {
  return new Response(CONTENT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
