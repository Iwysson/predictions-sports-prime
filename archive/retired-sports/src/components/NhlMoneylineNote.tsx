// Shared, exact wording for the NHL moneyline rule. Rendered as visible text (never only inside a
// tooltip) near the daily predictions and again in the history section.
export function NhlMoneylineNote() {
  return (
    <p className="nhl-moneyline-note">
      <strong>NHL Moneyline Rule:</strong> unless explicitly marked &ldquo;Regulation Only&rdquo;, all NHL moneyline
      picks on Predictions Sports Prime include overtime (OT) and shootout (SO).
    </p>
  );
}
