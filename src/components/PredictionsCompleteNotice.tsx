// Shown on the Football pages once there are no more active predictions to show
// for the current day: either every published game has finished, or nothing has
// been published yet for the day that just started. Never shown just because a kickoff time has
// passed - only when the page's own data genuinely has nothing left to display right now.
export function PredictionsCompleteNotice() {
  return (
    <div className="predictions-complete" role="status">
      <span className="predictions-complete__mark" aria-hidden="true">✓</span>
      <strong>Today&apos;s predictions are complete!</strong>
      <p>Check back after midnight (New York time) for the next daily update. Fresh predictions are on the way!</p>
    </div>
  );
}
