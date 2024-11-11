import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { SocialIcon } from 'react-social-icons'

export default function Footer() {
  return (
    <footer className="pt-9 pb-6 bg-footer-color text-justify">
      <div className="container mx-auto">
        <div className="rounded p-4 px-3 mb-1 border border-border-color">
          <p>
            We deal in guaranteed apple and Samsung phones both brand new, direct UK/US and fairly used. Swap your old phones to latest ones. Guaranteed Laptops, Accessories, Game consoles etc. Retail and bulk purchase always available.
          </p>
        </div>
        <div className="rounded p-4 px-3 border border-border-color">
          <p>
            Head Office📍Shop 9, F. Abel Complex, Opp Polaris bank, Abayomi, Iwo Road, Ibadan, Oyo State, Nigeria.
          </p>
          <p className="pb-5">
            BranchShop📍10, Railway Shopping Complex, Opposite IBEDC, Dugbe, Ibadan, Oyo State, Nigeria.
          </p>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <FontAwesomeIcon icon={faPhoneVolume} />
              <span className="font-bold">0806 741 4548</span>
            </div>
            <div className="flex gap-3">
              <SocialIcon url="https://x.com/worldkwise" bgColor="black" style={{ width: '2rem', height: '2rem'}} />
              <SocialIcon url="https://www.instagram.com/kwiseworld" bgColor="black" style={{ width: '2rem', height: '2rem' }} />
              <SocialIcon url="https://web.facebook.com/Kwiseworld" bgColor="black" style={{ width: '2rem', height: '2rem' }} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}