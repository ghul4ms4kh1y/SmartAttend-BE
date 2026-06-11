const Validator = require('fastest-validator');
const { LeaveRequest, User } = require('../models');
const response = require('../helpers/response.formatter');
const { uploadAttachment } = require('../middleware/upload');

const v = new Validator();

module.exports = {
  create: async (req, res, next) => {
    try {
      const schema = {
        start_date: { type: 'string' },
        end_date: { type: 'string' },
        type: { type: 'enum', values: ['sick', 'annual', 'personal'] },
        reason: { type: 'string', min: 3, optional: true }
      };
  
      const validate = v.compile(schema);
      const check = validate(req.body);
  
      if (check !== true) {
        return res.status(400).json(response(400, 'Validasi gagal', check));
      }
  
      const { start_date, end_date, type, reason } = req.body;
      const leave = await LeaveRequest.create({
        user_id: req.user.id,
        start_date,
        end_date,
        type,
        reason
      });
  
      res.status(201).json(response(201, 'Pengajuan izin berhasil', leave));
    } catch (err) {
      next(err);
    }
  },

  getMine: async (req, res, next) => {
    try {
      const rows = await LeaveRequest.findAll({
        where: { user_id: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      res.json(response(200, 'Riwayat izin saya', rows));
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const rows = await LeaveRequest.findAll({
        include: [{ model: User, attributes: ['name'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json(response(200, 'Semua pengajuan izin', rows));
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status } = req.params;
      if (!['approved', 'rejected'].includes(status))
        return res.status(400).json(response(400, 'Status tidak valid'));
  
      const leave = await LeaveRequest.findByPk(req.params.id);
      if (!leave) return res.status(404).json(response(404, 'Data tidak ditemukan'));
  
      await leave.update({ status });
  
      if (status === 'approved') {
        const { Attendance } = require('../models');
        const start = new Date(leave.start_date);
        const end   = new Date(leave.end_date);
  
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const date = d.toISOString().slice(0, 10);
  
          const existing = await Attendance.findOne({
            where: { user_id: leave.user_id, date }
          });
  
          if (existing) {
            // Sudah ada (absent/late/check-in) → paksa update jadi leave
            await existing.update({ status: 'leave' });
          } else {
            // Belum ada sama sekali → buat baru
            await Attendance.create({
              user_id: leave.user_id,
              date,
              status: 'leave',
            });
          }
        }
      }
  
      res.json(response(200, `Izin ${status}`));
    } catch (err) { next(err); }
  },

  uploadAttachment: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json(response(400, 'File tidak ditemukan'));
      }
      const { id } = req.params;
      await LeaveRequest.update(
        { attachment: req.file.filename },
        { where: { id, user_id: req.user.id } }
      );
      res.json(response(200, 'Bukti izin berhasil diupload', {
        attachment: req.file.filename,
      }));
    } catch (err) { next(err); }
  },
}




