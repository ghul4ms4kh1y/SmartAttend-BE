const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');
const { User } = require('../models');
const response = require('../helpers/response.formatter');
const baseConfig = require('../config/base.config');

const v = new Validator();


module.exports = {
  register: async (req, res, next) => {
    try {
      const schema = {
        name: { type: 'string', min: 2, max: 100 },
        email: { type: 'email' },
        password: { type: 'string', min: 6 },
        role: { type: 'enum', values: ['admin', 'employee'], optional: true }
      };
  
      const validate = v.compile(schema);
      const check = validate(req.body);
  
      if (check !== true) {
        return res.status(400).json(response(400, 'Validasi gagal', check));
      }
  
      const { name, email, password, department_id, role } = req.body;
  
      const exist = await User.findOne({ where: { email } });
      if (exist) return res.status(400).json(response(400, 'Email sudah terdaftar'));
  
      const hash = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        name,
        email,
        password_hash: hash,
        department_id: department_id || null,
        role: role || 'employee'
      });
  
      res.status(201).json(response(201, 'Registrasi berhasil', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }));
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const schema = {
        email: { type: 'email' },
        password: { type: 'string', min: 1 }
      };
  
      const validate = v.compile(schema);
      const check = validate(req.body);
  
      if (check !== true) {
        return res.status(400).json(response(400, 'Validasi gagal', check));
      }
  
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json(response(401, 'Email tidak ditemukan'));
  
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json(response(401, 'Password salah'));
  
      const token = jwt.sign(
        { id: user.id, role: user.role },
        baseConfig.jwt.secret,
        { expiresIn: baseConfig.jwt.expiresIn }
      );
  
      res.json(response(200, 'Login berhasil', {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo }
      }));
    } catch (err) {
      next(err);
    }
  },
  
  me: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password_hash'] }
      });
      res.json(response(200, 'Data user login', user));
    } catch (err) {
      next(err);
    }
  },
}


