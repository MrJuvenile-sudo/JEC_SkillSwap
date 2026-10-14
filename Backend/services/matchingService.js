/**
 * Helper to calculate matching score between two users
 * Returns score percentage (0-100) and match details
 */
function calculateMatchScore(currentUserSkills, targetUserSkills) {
  // Current user's offered and wanted skills
  const myOfferedIds = currentUserSkills
    .filter(s => s.type === 'offered')
    .map(s => s.skill_id);
  const myWantedIds = currentUserSkills
    .filter(s => s.type === 'wanted')
    .map(s => s.skill_id);

  // Target user's offered and wanted skills
  const targetOfferedIds = targetUserSkills
    .filter(s => s.type === 'offered')
    .map(s => s.skill_id);
  const targetWantedIds = targetUserSkills
    .filter(s => s.type === 'wanted')
    .map(s => s.skill_id);

  // 1. Direct 2-way match: Target offers what I want AND target wants what I offer
  const targetCanTeachMe = myWantedIds.filter(id => targetOfferedIds.includes(id));
  const ICanTeachTarget = myOfferedIds.filter(id => targetWantedIds.includes(id));

  const isTwoWay = targetCanTeachMe.length > 0 && ICanTeachTarget.length > 0;
  const isOneWay = targetCanTeachMe.length > 0 || ICanTeachTarget.length > 0;

  let score = 0;

  if (isTwoWay) {
    score = 85 + Math.min(15, (targetCanTeachMe.length + ICanTeachTarget.length - 2) * 5);
  } else if (isOneWay) {
    score = 50 + Math.min(30, (targetCanTeachMe.length + ICanTeachTarget.length - 1) * 10);
  } else {
    score = 10;
  }

  return {
    score: Math.min(100, score),
    isTwoWay,
    canTeachMeSkillIds: targetCanTeachMe,
    canTeachTargetSkillIds: ICanTeachTarget
  };
}

module.exports = {
  calculateMatchScore
};
