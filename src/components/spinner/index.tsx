import "./spinner.css";

export function Spinner() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <h1 className="text-xl">
        LOADING
        <span className="dot-one"> .</span>
        <span className="dot-two"> .</span>
        <span className="dot-three"> .</span>
      </h1>
    </div>
  );
}
