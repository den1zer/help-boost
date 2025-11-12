const Skin = require('../models/Skin');
exports.getAllSkins = async (req, res) => {
  try {
    const skins = await Skin.find();
    res.json(skins);
  } catch (err) {
    res.status(500).send('Помилка на сервері');
  }
};