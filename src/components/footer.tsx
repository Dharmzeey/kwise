import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Footer(){
  return (
    <footer className="pt-9 pb-6 px-4 bg-footer-color text-justify">
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
            <FontAwesomeIcon icon={faPhoneVolume}/>
            <span className="font-bold">0806 741 4548</span>
          </div>
          <div className="flex gap-3">
          <span>ING</span>
            <span>TWT</span>
            <span>FCB</span>
          </div>
        </div>
      </div>
    </footer>
  )
}