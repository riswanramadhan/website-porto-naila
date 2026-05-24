export default function GlobalDecor() {
  return (
    <>
      <div className="ambient-bg" aria-hidden="true">
        <span className="ambient-orb orb-one"></span>
        <span className="ambient-orb orb-two"></span>
        <span className="ambient-orb orb-three"></span>
        <span className="magic-line line-one"></span>
        <span className="magic-line line-two"></span>
      </div>
      <div className="cursor-dot" aria-hidden="true"></div>
      <div className="cursor-ring" aria-hidden="true"></div>
    </>
  );
}
