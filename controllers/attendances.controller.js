const Validator = require('fastest-validator');
const { Attendance, User } = require('../models');
const response = require('../helpers/response.formatter');

const v = new Validator();
const JAM_MASUK = '08:00:00';

exports.checkIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toTimeString().slice(0, 8);
    const status = now > JAM_MASUK ? 'late' : 'present';

    // findOrCreate — cari data hari ini, kalau tidak ada baru insert
    // Sekaligus mencegah check-in 2x dalam satu hari
    const [record, created] = await Attendance.findOrCreate({
      where: { user_id: userId, date: today },
      defaults: { check_in: now, status }
    });

    if (!created) {
      return res.status(400).json(response(400, 'Sudah check-in hari ini'));
    }

    res.status(201).json(response(201, 'Check-in berhasil', {
      date: today,
      check_in: now,
      status
    }));
  } catch (err) {
    next(err);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toTimeString().slice(0, 8);

    const record = await Attendance.findOne({
      where: { user_id: userId, date: today }
    });

    if (!record) {
      return res.status(400).json(response(400, 'Belum check-in hari ini'));
    }
    if (record.check_out) {
      return res.status(400).json(response(400, 'Sudah check-out hari ini'));
    }

    await record.update({ check_out: now });
    res.json(response(200, 'Check-out berhasil', { check_out: now }));
  } catch (err) {
    next(err);
  }
};

exports.getMyHistory = async (req, res, next) => {
  try {
    const rows = await Attendance.findAll({
      where: { user_id: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(response(200, 'Riwayat absensi saya', rows));
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const rows = await Attendance.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['date', 'DESC']]
    });
    res.json(response(200, 'Semua data absensi', rows));
  } catch (err) {
    next(err);
  }
};
