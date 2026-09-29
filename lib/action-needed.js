'use strict';

/**
 * A trash type needs action while its next pickup is within the configured number of days and it is not completed yet.
 * Evaluated on every refresh, so the flag also drops back to false once the pickup has passed.
 *
 * @param {number} daysLeft days until the next pickup of this type
 * @param {number} daysUntilAction configured number of days before the pickup (daysuntilaction)
 * @param {boolean} completed value of the "completed" state of this type
 * @returns {boolean} value for the "actionNeeded" state
 */
function isActionNeeded(daysLeft, daysUntilAction, completed) {
    return daysLeft <= daysUntilAction && !completed;
}

module.exports = { isActionNeeded };
