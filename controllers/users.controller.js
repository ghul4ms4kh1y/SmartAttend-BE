const Validator = require('fastest-validator');
const { User, Department } = require('../models');
const response = require('../helpers/response.formatter');
const { uploadProfile } = require('../middleware/upload');

const v = new Validator();

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password_hash'] },
        include: [{ model: Department, attributes: ['name'] }]
      });
      res.json(response(200, 'Daftar pengguna', users));
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password_hash'] },
        include: [{ model: Department, attributes: ['name'] }]
      });
      
      if (!user) {
        return res.status(404).json(response(404, 'User tidak ditemukan'));
      }
      
      res.json(response(200, 'Detail user', user));
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const schema = {
        name: { type: 'string', min: 2, optional: true },
        department_id: { type: 'number', optional: true },
        role: { type: 'enum', values: ['admin', 'employee'], optional: true }
      };
      
      const validate = v.compile(schema);
      const check = validate(req.body);
      
      if (check !== true) {
        return res.status(400).json(response(400, 'Validasi gagal', check));
      }
      
      const { name, department_id, role } = req.body;
      await User.update(
        { name, department_id, role },
        { where: { id: req.params.id } }
      );
      
      res.json(response(200, 'User diperbarui'));
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      await User.destroy({ where: { id: req.params.id } });
      res.json(response(200, 'User dihapus'));
    } catch (err) {
      next(err);
    }
  },

  uploadPhoto: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json(response(400, 'File tidak ditemukan'));
      }
      const filename = req.file.filename;
      await User.update(
        { photo: filename },
        { where: { id: req.user.id } }
      );
      res.json(response(200, 'Foto profil berhasil diupload', { photo: filename }));
    } catch (err) { next(err); }
  },
}



