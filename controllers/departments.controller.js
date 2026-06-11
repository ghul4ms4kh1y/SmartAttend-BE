const Validator = require('fastest-validator');
const { Department } = require('../models');
const response = require('../helpers/response.formatter');

const v = new Validator();


module.exports = {
  getAll: async (req, res, next) => {
    try {
      const data = await Department.findAll();
      res.json(response(200, 'Daftar departemen', data));
    } catch (err) {
      next(err);
    }
  },
  
  create: async (req, res, next) => {
    try {
      const schema = { name: { type: 'string', min: 2, max: 100 } };
      const validate = v.compile(schema);
      const check = validate(req.body);
  
      if (check !== true) {
        return res.status(400).json(response(400, 'Validasi gagal', check));
      }
  
      const dept = await Department.create({ name: req.body.name });
      res.status(201).json(response(201, 'Departemen ditambahkan', dept));
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const schema = { name: { type: 'string', min: 2, max: 100 } };
      const validate = v.compile(schema);
      const check = validate(req.body);
  
      if (check !== true) {
        return res.status(400).json(response(400, 'Validasi gagal', check));
      }
  
      await Department.update(
        { name: req.body.name },
        { where: { id: req.params.id } }
      );
      res.json(response(200, 'Departemen diperbarui'));
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      await Department.destroy({ where: { id: req.params.id } });
      res.json(response(200, 'Departemen dihapus'));
    } catch (err) {
      next(err);
    }
  },
}



