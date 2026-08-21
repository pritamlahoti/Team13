const { Router } = require('express');
const reviewsService = require('./reviews.service');
const { scoreSubmissionSchema } = require('./reviews.schema');
const { requireAuth, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { ROLES } = require('../../constants/roles');

const router = Router();

router.post(
  '/submissions/:id/score',
  requireAuth,
  requireRole(ROLES.KATALYST_MANAGEMENT),
  validate(scoreSubmissionSchema),
  async (req, res) => {
    const { outcome, feedbackText, xpAwarded } = req.body;
    const result = await reviewsService.scoreSubmission({
      submissionId: req.params.id,
      managementUserId: req.user.id,
      outcome,
      feedbackText,
      xpAwarded,
    });
    res.status(201).json(result);
  }
);

module.exports = router;
