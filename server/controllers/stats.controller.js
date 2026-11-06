import Listing from '../models/Listing.js';

/**
 * Public impact statistics for the landing page.
 * Aggregates all completed food donations across the entire platform.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getStats(req, res) {
  // Aggregation Pipeline: runs inside MongoDB engine for maximum efficiency
  const [row] = await Listing.aggregate([
    { $match: { status: 'completed' } }, // Stage 1: Only count food that was actually collected
    {
      $group: {
        _id: null,
        mealsRescued: { $sum: '$quantity' }, // Sum of all portions/meals saved
        pickups: { $sum: 1 }, // Total count of completed donation transactions
      },
    },
  ]);

  // If no listings have been completed yet, row is undefined.
  // We return zeros rather than failing or returning null.
  res.status(200).json({
    mealsRescued: row?.mealsRescued ?? 0,
    pickups: row?.pickups ?? 0,
  });
}
