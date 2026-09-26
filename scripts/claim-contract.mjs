import assert from "node:assert/strict";

// Single owner of compatibility-status vocabulary, claim field shape, and
// validation-window derivation. build-skill.mjs and validate-skill.mjs both
// import from here; neither may redefine these facts locally.

const CLAIM_STATUSES = Object.freeze(["widely", "newly", "limited", "watchlist"]);

const STATUS_LABELS = Object.freeze({
  widely: "Widely available",
  newly: "Newly available — verify floor",
  limited: "Limited availability — enhancement only",
  watchlist: "Experimental / watchlist",
});

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTH_YEAR_PATTERN =
  "(?:January|February|March|April|May|June|July|August|September|October|November|December) \\d{4}";

export function isKnownStatus(status) {
  return CLAIM_STATUSES.includes(status);
}

export function statusLabel(status) {
  const label = STATUS_LABELS[status];

  if (!label) {
    throw new Error(`Unknown compatibility status ${status}.`);
  }

  return label;
}

function monthYearRank(value) {
  const match =
    typeof value === "string" ? value.trim().match(/^([A-Z][a-z]+)\s+(\d{4})$/) : null;

  if (!match) {
    return null;
  }

  const monthIndex = MONTHS.indexOf(match[1]);

  if (monthIndex === -1) {
    return null;
  }

  return Number(match[2]) * 12 + monthIndex;
}

export function deriveValidationWindow(evidence) {
  const claimEntries = Array.isArray(evidence.claims) ? evidence.claims : [];

  if (claimEntries.length > 0) {
    const unparseable = claimEntries.filter((claim) => monthYearRank(claim?.reviewed_at) === null);

    assert.equal(
      unparseable.length,
      0,
      `evidence.claims entries missing or with unparseable reviewed_at: ${unparseable
        .map((claim) => claim?.id || "<unknown>")
        .join(", ")}`,
    );
  }

  const months = claimEntries
    .map((claim) => ({ claim: claim.id || "<unknown>", rank: monthYearRank(claim.reviewed_at) }))
    .filter((entry) => entry.rank !== null)
    .sort((left, right) => right.rank - left.rank);

  assert.ok(months.length > 0, "evidence.claims has no parseable reviewed_at month; the validation window cannot be derived.");

  const [latest] = months;

  return MONTHS[latest.rank % 12] + " " + Math.floor(latest.rank / 12);
}
