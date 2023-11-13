import MarketplaceComponent from "../components/Marketplace/MarketplaceComponent";

export default function ClaimPage() {
  return (
    <div className="scroll-smooth ">
      <div className="absolute z-10">
        <div
          className={` justify-center mx-auto text-center`}
          style={{ fontFamily: `'Plus Jakarta Sans' sans-serif` }}
        >
          <div className={`  text-center self-center justify-center`}>
            <MarketplaceComponent />
          </div>
          <p className={"my-5"}></p>
        </div>
      </div>
    </div>
  );
}
