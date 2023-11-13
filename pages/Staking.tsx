import NewStakeComponent from "../components/Stake/NewStakeComponent";

export default function ClaimPage() {
  return (
    <div className="scroll-smooth ">
      <div className="relative z-10">
        <div
          className={`flex flex-col justify-center mx-auto text-center`}
        >
          <div className={`text-center self-center justify-center`}>
            <NewStakeComponent/>
          </div>
        </div>
      </div>
    </div>
  );
}
