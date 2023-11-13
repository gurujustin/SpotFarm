import ClaimComponent from "../components/Claim/ClaimComponent";

export default function ClaimPage() {
  return (
    <div className="scroll-smooth ">
        <div className="w-full relative z-10">
          <div
            className="w-full lg:w-auto flex justify-center mx-auto text-center"
            style={{ fontFamily: `'Plus Jakarta Sans', sans-serif` }}
          >
            <div className="text-center self-center justify-center">
              <ClaimComponent />
            </div>
          </div>
        </div>
    </div>
  );
}
