const Budget = require('../models/Budget');

const getBudgetByEvent = async (req, res, next) => {
  try {
    const items = await Budget.find({ eventId: req.params.eventId });
    const totalEstimated = items.reduce((sum, item) => sum + item.estimatedAmount, 0);
    const totalActual = items.reduce((sum, item) => sum + item.actualAmount, 0);
    res.json({ success: true, items, totalEstimated, totalActual });
  } catch (error) {
    next(error);
  }
};

const updateBudgetItem = async (req, res, next) => {
  try {
    const item = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Budget item not found.' });
    }
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudgetByEvent, updateBudgetItem };
